import { describe, expect, it } from "vitest";
import { prepareArticleContent } from "./sanitize";

describe("prepareArticleContent", () => {
  it("remove scripts, preserva blocos editoriais e constrói sumário", () => {
    const result = prepareArticleContent('<script>alert(1)</script><h2>Primeira fase</h2><p>Texto</p><h3>Chefe final</h3><h2>Primeira fase</h2>');
    expect(result.html).not.toContain("script");
    expect(result.html).toContain('id="primeira-fase"');
    expect(result.html).toContain('id="primeira-fase-2"');
    expect(result.headings).toEqual([
      { id: "primeira-fase", label: "Primeira fase", level: 2 },
      { id: "chefe-final", label: "Chefe final", level: 3 },
      { id: "primeira-fase-2", label: "Primeira fase", level: 2 },
    ]);
  });

  it("protege links externos abertos em nova aba", () => {
    expect(prepareArticleContent('<a href="https://example.com" target="_blank">Fonte</a>').html).toContain('rel="noopener noreferrer"');
  });
});
