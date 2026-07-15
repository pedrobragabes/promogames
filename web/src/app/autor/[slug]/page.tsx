import { notFound } from "next/navigation";
import { ArchiveHeader, StoryArchive } from "@/components/editorial/archive";
import { parsePage } from "@/lib/pagination";
import { getAuthorBySlug, getAuthors, getStories } from "@/lib/wordpress/queries";

export async function generateStaticParams() {
  return (await getAuthors()).map((author) => ({ slug: author.slug }));
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
