import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/editorial/article-body";
import { formatDate } from "@/lib/format";
import { getStories, getStoryBySlug } from "@/lib/wordpress/queries";

export async function generateStaticParams() {
  const { items } = await getStories({ perPage: 12 });
  return items.map((story) => ({ slug: story.slug }));
}

export default async function StoryPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) notFound();

  const shareUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://promogamesbr.com"}${story.href}`);
  const shareTitle = encodeURIComponent(story.title);

  return (
    <article className="pb-20">
      <header className="border-b border-line bg-surface px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1220px]">
          <div className="flex flex-wrap gap-2">
            {story.categories.map((category) => (
              <Link key={category.id} href={`/categoria/${category.slug}/`} className="rounded-full bg-canvas px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.08em] text-brand">
                {category.name}
              </Link>
            ))}
          </div>
          <h1 className="font-display mt-6 max-w-5xl text-balance text-[clamp(2.45rem,6.2vw,5.7rem)] font-extrabold leading-[0.96] tracking-[-0.065em]">
            {story.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted sm:text-xl">
            {story.deck ?? story.excerpt}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6 text-sm">
            <span className="font-extrabold">Por {story.author.name}</span>
            <span className="text-muted">{formatDate(story.publishedAt, true)}</span>
            <span className="text-muted">{story.readingMinutes} min de leitura</span>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1220px]">
          <div className="relative -mt-px aspect-video overflow-hidden rounded-b-card bg-ink">
            {story.image ? (
              <Image
                fill
                priority
                src={story.image.url}
                alt={story.image.alt || story.title}
                sizes="(max-width: 1024px) 100vw, 1220px"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="grid gap-10 py-10 lg:grid-cols-[80px_minmax(0,760px)_minmax(180px,1fr)] lg:py-14">
            <aside className="flex gap-2 lg:sticky lg:top-6 lg:h-fit lg:flex-col" aria-label="Compartilhar matéria">
              <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full border border-line bg-surface text-xs font-black transition hover:border-brand hover:text-brand" aria-label="Compartilhar no X">X</a>
              <a href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full border border-line bg-surface text-xs font-black transition hover:border-brand hover:text-brand" aria-label="Compartilhar no WhatsApp">WA</a>
            </aside>

            <ArticleBody html={story.content} />

            <aside className="h-fit rounded-card border border-line bg-surface p-5 lg:sticky lg:top-6">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.1em] text-brand">Sobre o autor</p>
              <div className="mt-4 flex items-center gap-3">
                {story.author.avatarUrl ? (
                  <Image src={story.author.avatarUrl} width={48} height={48} alt="" className="rounded-full" />
                ) : (
                  <span className="grid size-12 place-items-center rounded-full bg-brand font-display font-black text-white">PG</span>
                )}
                <div>
                  <p className="font-display font-extrabold">{story.author.name}</p>
                  <p className="text-xs text-muted">Redação PromoGames</p>
                </div>
              </div>
              {story.author.description ? <p className="mt-4 text-sm leading-6 text-muted">{story.author.description}</p> : null}
            </aside>
          </div>
        </div>
      </div>
    </article>
  );
}
