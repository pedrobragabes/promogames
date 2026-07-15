import sanitizeHtml from "sanitize-html";
import { plainText, slugifyHeading } from "../wordpress/text";

export type ArticleHeading = {
  id: string;
  label: string;
  level: 2 | 3;
};

function sanitize(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "figure",
      "figcaption",
      "img",
      "iframe",
      "video",
      "source",
      "picture",
    ]),
    allowedAttributes: {
      "*": ["class", "id", "aria-label"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "srcset", "sizes", "alt", "title", "width", "height", "loading", "decoding"],
      iframe: ["src", "title", "width", "height", "allow", "allowfullscreen", "loading"],
      video: ["src", "controls", "poster", "preload", "width", "height"],
      source: ["src", "srcset", "type", "media"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedIframeHostnames: ["www.youtube.com", "youtube.com", "player.vimeo.com"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: attribs.target === "_blank" ? "noopener noreferrer" : attribs.rel,
        },
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: attribs.loading ?? "lazy", decoding: "async" },
      }),
      iframe: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: "lazy" },
      }),
    },
  });
}

export function prepareArticleContent(html: string) {
  const usedIds = new Map<string, number>();
  const headings: ArticleHeading[] = [];
  const safeHtml = sanitize(html).replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, rawLevel: string, rawAttributes: string, innerHtml: string) => {
      const label = plainText(innerHtml);
      if (!label) return match;

      const baseId = slugifyHeading(label);
      const occurrence = usedIds.get(baseId) ?? 0;
      usedIds.set(baseId, occurrence + 1);
      const id = occurrence ? `${baseId}-${occurrence + 1}` : baseId;
      const level = Number(rawLevel) as 2 | 3;
      headings.push({ id, label, level });

      const attributes = rawAttributes.replace(/\s+id=("[^"]*"|'[^']*')/gi, "");
      return `<h${level}${attributes} id="${id}">${innerHtml}</h${level}>`;
    },
  );

  return { html: safeHtml, headings };
}

export function sanitizeArticleHtml(html: string) {
  return prepareArticleContent(html).html;
}
