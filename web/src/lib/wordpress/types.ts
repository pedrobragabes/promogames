export type WordPressImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type WordPressAuthor = {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatarUrl?: string;
};

export type WordPressTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  parent?: number;
  count?: number;
  description?: string;
};

export type Story = {
  id: number;
  slug: string;
  href: string;
  sourceUrl: string;
  title: string;
  excerpt: string;
  content: string;
  deck?: string;
  publishedAt: string;
  modifiedAt: string;
  author: WordPressAuthor;
  image?: WordPressImage;
  categories: WordPressTerm[];
  tags: WordPressTerm[];
  primaryCategory?: WordPressTerm;
  readingMinutes: number;
  editorialType?: string;
  platforms: string[];
  reviewScore?: number;
  featured: boolean;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type StoryQuery = {
  page?: number;
  perPage?: number;
  search?: string;
  categoryId?: number;
  authorId?: number;
  exclude?: number[];
  sticky?: boolean;
};
