type RawRendered = {
  rendered: string;
  protected?: boolean;
};

export type RawAuthor = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  avatar_urls?: Record<string, string>;
};

export type RawTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  parent?: number;
  count?: number;
  description?: string;
};

export type RawMedia = {
  source_url: string;
  alt_text?: string;
  caption?: RawRendered;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<
      string,
      {
        source_url?: string;
        width?: number;
        height?: number;
      }
    >;
  };
};

export type RawPostMeta = {
  promogames_deck?: string;
  promogames_editorial_type?: string;
  promogames_platforms?: string[] | string;
  promogames_review_score?: number | string;
  promogames_featured?: boolean | string | number;
};

export type RawPost = {
  id: number;
  slug: string;
  link: string;
  date: string;
  modified: string;
  title: RawRendered;
  excerpt: RawRendered;
  content?: RawRendered;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  meta?: RawPostMeta;
  _embedded?: {
    author?: RawAuthor[];
    "wp:featuredmedia"?: RawMedia[];
    "wp:term"?: RawTerm[][];
  };
};

export type RawCategory = RawTerm & {
  taxonomy?: "category";
};
