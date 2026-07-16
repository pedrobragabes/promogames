import "server-only";

import { cache } from "react";
import { wordPressRequest } from "./client";
import { fallbackStories } from "./fallback";
import { mapAuthor, mapPost, mapTerm } from "./mappers";
import type { RawAuthor, RawCategory, RawPost } from "./raw-types";
import type { Paginated, Story, StoryQuery, WordPressAuthor, WordPressTerm } from "./types";

const LIST_FIELDS = [
  "id",
  "date",
  "modified",
  "slug",
  "link",
  "title",
  "excerpt",
  "author",
  "featured_media",
  "categories",
  "tags",
  "meta",
  "_links",
  "_embedded",
].join(",");

const DETAIL_FIELDS = `${LIST_FIELDS},content`;
const EMBED = "author,wp:featuredmedia,wp:term";

export async function getStories(query: StoryQuery = {}): Promise<Paginated<Story>> {
  const page = Math.max(1, query.page ?? 1);
  const perPage = Math.min(24, Math.max(1, query.perPage ?? 12));

  try {
    const response = await wordPressRequest<RawPost[]>(
      "/posts",
      {
        page,
        per_page: perPage,
        search: query.search,
        categories: query.categoryId,
        author: query.authorId,
        exclude: query.exclude,
        sticky: query.sticky,
        _embed: EMBED,
        _fields: LIST_FIELDS,
      },
      ["wordpress", "stories"],
    );

    return {
      items: response.data.map(mapPost),
      page,
      perPage,
      total: response.total,
      totalPages: response.totalPages,
    };
  } catch (error) {
    console.error("[wordpress] Falha ao carregar matérias", error);
    const items = page === 1 && !query.search && !query.categoryId && !query.authorId
      ? fallbackStories.slice(0, perPage)
      : [];
    return { items, page, perPage, total: items.length, totalPages: items.length ? 1 : 0 };
  }
}

export const getStoryBySlug = cache(async (slug: string): Promise<Story | null> => {
  try {
    const response = await wordPressRequest<RawPost[]>(
      "/posts",
      {
        slug,
        per_page: 1,
        _embed: EMBED,
        _fields: DETAIL_FIELDS,
      },
      ["wordpress", "stories", `story:${slug}`],
    );
    return response.data[0] ? mapPost(response.data[0]) : null;
  } catch (error) {
    console.error(`[wordpress] Falha ao carregar matéria ${slug}`, error);
    return fallbackStories.find((story) => story.slug === slug) ?? null;
  }
});

function getPreviewAuthorization() {
  const username = process.env.WORDPRESS_USERNAME;
  const password = process.env.WORDPRESS_APPLICATION_PASSWORD;
  if (!username || !password) return null;
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

export async function getPreviewStoryById(id: number): Promise<Story | null> {
  const authorization = getPreviewAuthorization();
  if (!authorization || !Number.isInteger(id) || id < 1) return null;

  try {
    const response = await wordPressRequest<RawPost>(
      `/posts/${id}`,
      { context: "edit", _embed: EMBED, _fields: DETAIL_FIELDS },
      [],
      { cache: "no-store", headers: { Authorization: authorization } },
    );
    return mapPost(response.data);
  } catch (error) {
    console.error(`[wordpress] Falha ao carregar preview ${id}`, error);
    return null;
  }
}

type SitemapStory = Pick<Story, "id" | "slug" | "href" | "modifiedAt" | "image">;

export const getSitemapStories = cache(async (): Promise<SitemapStory[]> => {
  const stories: SitemapStory[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await wordPressRequest<RawPost[]>(
        "/posts",
        { page, per_page: 100, _embed: "wp:featuredmedia", _fields: LIST_FIELDS },
        ["wordpress", "stories"],
      );
      stories.push(...response.data.map(mapPost));
      totalPages = Math.min(response.totalPages, 20);
      page += 1;
    } while (page <= totalPages);
    return stories;
  } catch (error) {
    console.error("[wordpress] Falha ao montar sitemap", error);
    return stories.length ? stories : fallbackStories;
  }
});

export const getCategories = cache(async (): Promise<WordPressTerm[]> => {
  try {
    const response = await wordPressRequest<RawCategory[]>(
      "/categories",
      { per_page: 100, hide_empty: true, _fields: "id,name,slug,parent,count,description" },
      ["wordpress", "categories"],
    );
    return response.data.map(mapTerm).sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
  } catch (error) {
    console.error("[wordpress] Falha ao carregar categorias", error);
    return [];
  }
});

export const getCategoryBySlug = cache(async (slug: string): Promise<WordPressTerm | null> => {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
});

export const getAuthors = cache(async (): Promise<WordPressAuthor[]> => {
  try {
    const response = await wordPressRequest<RawAuthor[]>(
      "/users",
      { per_page: 100, _fields: "id,name,slug,description,avatar_urls" },
      ["wordpress", "authors"],
    );
    return response.data.map(mapAuthor);
  } catch (error) {
    console.error("[wordpress] Falha ao carregar autores", error);
    return [];
  }
});

export const getAuthorBySlug = cache(async (slug: string): Promise<WordPressAuthor | null> => {
  const authors = await getAuthors();
  return authors.find((author) => author.slug === slug) ?? null;
});
