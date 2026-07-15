import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveHeader, StoryArchive } from "@/components/editorial/archive";
import { parsePage } from "@/lib/pagination";
import { getAuthorBySlug, getAuthors, getStories } from "@/lib/wordpress/queries";

export async function generateStaticParams() {
  return (await getAuthors()).map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps<"/autor/[slug]">): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const author = await getAuthorBySlug(slug);
  if (!author) return {};
  const page = parsePage(query.page);
  const canonical = `/autor/${slug}/${page > 1 ? `?page=${page}` : ""}`;
  return {
    title: `${author.name}${page > 1 ? ` — Página ${page}` : ""}`,
    description: author.description || `Leia as matérias de ${author.name} no PromoGames.`,
    alternates: { canonical },
  };
}

export default async function AuthorPage({ params, searchParams }: PageProps<"/autor/[slug]">) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const page = parsePage(query.page);
  const result = await getStories({ authorId: author.id, page, perPage: 12 });
  if (page > 1 && result.totalPages > 0 && page > result.totalPages) notFound();

  return (
    <>
      <ArchiveHeader eyebrow="Autor" title={author.name} description={author.description || "Redação, apuração e opinião no PromoGames."} count={result.total} avatarUrl={author.avatarUrl} />
      <StoryArchive result={result} emptyMessage="Este autor ainda não publicou matérias." />
    </>
  );
}
