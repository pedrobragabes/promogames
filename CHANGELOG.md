# Changelog

## 1.1.0 — 2026-07-26

- perfil JoystickNights conectado ao WordPress real, mantendo o perfil PromoGames para a réplica futura;
- permalinks legados de matérias, categorias aninhadas, tags, autores e páginas preservados;
- consentimento granular, Google Tag, AdSense, `ads.txt`, feed e verificação Google;
- comentários moderados por proxy same-origin e endpoint WordPress assinado;
- metadados do The SEO Framework e SEOPress normalizados no contrato REST;
- curadoria da home, revalidação de páginas/comentários e proxy de mídia/admin do CMS;
- card social e favicon próprios do JoystickNights;
- logo horizontal oficial no cabeçalho/rodapé e correção de imagens com lazy-load herdado do WordPress;
- tema escuro como padrão, alternância animada para o modo claro e preferência persistida no navegador;
- webhook limitado e revalidação de comentários restrita ao conteúdo realmente visível;
- runbook de beta, cutover e rollback, testes profile-aware e dependências de produção sem alertas no `npm audit`.

## 1.0.0 — 2026-07-15

- novo front editorial headless em Next.js 16 e React 19;
- identidade visual própria, responsiva e sem kit de UI;
- integração completa com posts, categorias, autores e mídia do WordPress;
- busca, paginação, matérias Gutenberg, sumário e relacionados;
- plugin PromoGames Core com metacampos, curadoria, preview e webhooks;
- SEO técnico, analytics opcional e espaços publicitários estáveis;
- testes unitários/E2E, CI, segurança, deploy e rollback documentados.
