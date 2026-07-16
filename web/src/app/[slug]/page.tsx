import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryArticle } from "@/components/editorial/story-article";
import { getStories, getStoryBySlug } from "@/lib/wordpress/queries";

export async function generateStaticParams() {
  const { items } = await getStories({ perPage: 12 });
  return items.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return {};

  const description = story.deck ?? story.excerpt;
  return {
    title: story.title,
    description,
    authors: [{ name: story.author.name, url: `/autor/${story.author.slug}/` }],
    alternates: { canonical: story.href },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: "PromoGames",
      url: story.href,
      title: story.title,
      description,
      publishedTime: story.publishedAt,
      modifiedTime: story.modifiedAt,
      authors: [story.author.name],
      tags: [...story.categories, ...story.tags].map((term) => term.name),
      images: story.image ? [{ url: story.image.url, width: story.image.width, height: story.image.height, alt: story.image.alt || story.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description,
      images: story.image ? [story.image.url] : undefined,
    },
  };
}

export default async function StoryPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) notFound();
  return <StoryArticle story={story} />;
}
