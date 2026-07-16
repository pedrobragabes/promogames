import type { MetadataRoute } from "next";
import { getAuthors, getCategories, getSitemapStories } from "@/lib/wordpress/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://promogamesbr.com").replace(/\/$/, "");
  const [stories, categories, authors] = await Promise.all([getSitemapStories(), getCategories(), getAuthors()]);

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    ...categories.map((category) => ({ url: `${siteUrl}/categoria/${category.slug}/`, changeFrequency: "daily" as const, priority: 0.7 })),
    ...authors.map((author) => ({ url: `${siteUrl}/autor/${author.slug}/`, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...stories.map((story) => ({
      url: `${siteUrl}${story.href}`,
      lastModified: story.modifiedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: story.image ? [story.image.url] : undefined,
    })),
  ];
}
