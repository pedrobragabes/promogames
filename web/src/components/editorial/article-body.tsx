import { sanitizeArticleHtml } from "@/lib/content/sanitize";

export function ArticleBody({ html }: { html: string }) {
  return <div className="article-body" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(html) }} />;
}
