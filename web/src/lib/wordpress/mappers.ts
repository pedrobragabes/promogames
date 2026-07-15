import type { RawAuthor, RawCategory, RawMedia, RawPost, RawTerm } from "./raw-types";
import { decodeHtmlEntities, plainText, readingTime, truncateText } from "./text";
import type { Story, WordPressAuthor, WordPressImage, WordPressTerm } from "./types";

const fallbackAuthor: WordPressAuthor = {
  id: 0,
  name: "Redação PromoGames",
  slug: "redacao-promogames",
  description: "Notícias, análises e guias para quem vive videogames.",
};

export function mapAuthor(author?: RawAuthor): WordPressAuthor {
  if (!author) return fallbackAuthor;

  return {
    id: author.id,
    name: decodeHtmlEntities(author.name),
    slug: author.slug,
    description: plainText(author.description ?? ""),
    avatarUrl: author.avatar_urls?.["96"] ?? author.avatar_urls?.["48"],
  };
}

export function mapTerm(term: RawTerm | RawCategory): WordPressTerm {
  return {
    id: term.id,
    name: decodeHtmlEntities(term.name),
    slug: term.slug,
    taxonomy: term.taxonomy ?? "category",
    parent: term.parent,
    count: term.count,
    description: plainText(term.description ?? ""),
  };
}

function mapImage(media?: RawMedia): WordPressImage | undefined {
  if (!media?.source_url) return undefined;

  const preferred =
    media.media_details?.sizes?.large ?? media.media_details?.sizes?.full;

  return {
    url: preferred?.source_url ?? media.source_url,
    width: preferred?.width ?? media.media_details?.width ?? 1600,
    height: preferred?.height ?? media.media_details?.height ?? 900,
    alt: plainText(media.alt_text ?? ""),
    caption: plainText(media.caption?.rendered ?? "") || undefined,
  };
}

function getTerms(post: RawPost) {
  return (post._embedded?.["wp:term"] ?? []).flat().map(mapTerm);
}

function toBoolean(value: boolean | string | number | undefined) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function toPlatforms(value: string[] | string | undefined) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

export function mapPost(post: RawPost): Story {
  const terms = getTerms(post);
  const categories = terms.filter((term) => term.taxonomy === "category");
  const tags = terms.filter((term) => term.taxonomy === "post_tag");
  const content = post.content?.rendered ?? "";
  const primaryCategory =
    categories.find((category) => category.slug !== "noticias") ?? categories[0];
  const rawScore = post.meta?.promogames_review_score;
  const reviewScore = rawScore === undefined || rawScore === "" ? undefined : Number(rawScore);

  return {
    id: post.id,
    slug: post.slug,
    href: `/${post.slug}/`,
    sourceUrl: post.link,
    title: plainText(post.title.rendered),
    excerpt: truncateText(post.excerpt.rendered),
    content,
    deck: plainText(post.meta?.promogames_deck ?? "") || undefined,
    publishedAt: post.date,
    modifiedAt: post.modified,
    author: mapAuthor(post._embedded?.author?.[0]),
    image: mapImage(post._embedded?.["wp:featuredmedia"]?.[0]),
    categories,
    tags,
    primaryCategory,
    readingMinutes: readingTime(content || post.excerpt.rendered),
    editorialType: post.meta?.promogames_editorial_type,
    platforms: toPlatforms(post.meta?.promogames_platforms),
    reviewScore: Number.isFinite(reviewScore) ? reviewScore : undefined,
    featured: toBoolean(post.meta?.promogames_featured),
  };
}
