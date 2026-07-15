import type { Story } from "./types";

const author = {
  id: 0,
  name: "Redação PromoGames",
  slug: "redacao-promogames",
  description: "Notícias, análises e guias para quem vive videogames.",
};

const category = {
  id: 70,
  name: "Notícias",
  slug: "noticias",
  taxonomy: "category",
};

const titles = [
  [6679, "novidades-de-julho-no-catalogo-playstation-plus-avatar-rise-of-the-ronin-e-incendios-reais-chegam-com-tudo", "Novidades de julho no Catálogo PlayStation Plus chegam com tudo"],
  [6643, "granblue-fantasy-relink-endless-ragnarok-review", "Granblue Fantasy Relink: Endless Ragnarok — Review"],
  [6659, "assassins-creed-black-flag-resynced-vende-o-dobro-de-shadows-no-lancamento-aponta-relatorio", "Assassin’s Creed Black Flag Resynced estreia em alta"],
  [6653, "playstation-plus-recebe-nove-novos-jogos-no-catalogo-em-julho", "PlayStation Plus recebe nove novos jogos no catálogo"],
] as const;

export const fallbackStories: Story[] = titles.map(([id, slug, title], index) => ({
  id,
  slug,
  href: `/${slug}/`,
  sourceUrl: `https://promogamesbr.com/${slug}/`,
  title,
  excerpt: "A redação está reconectando com o WordPress. Enquanto isso, este destaque mantém a experiência disponível.",
  content: `<p>Conteúdo temporariamente indisponível. Tente novamente em instantes.</p>`,
  publishedAt: new Date(Date.UTC(2026, 6, 15, 15 - index)).toISOString(),
  modifiedAt: new Date(Date.UTC(2026, 6, 15, 15 - index)).toISOString(),
  author,
  categories: [category],
  tags: [],
  primaryCategory: category,
  readingMinutes: 1,
  platforms: [],
  featured: index === 0,
}));
