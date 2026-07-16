# PromoGames v1.0.0

A primeira versão completa da nova experiência editorial do PromoGames mantém o WordPress para a redação e substitui a camada pública por um front Next.js próprio.

## Destaques

- visual editorial elétrico com destaques verticais e navegação responsiva;
- páginas públicas completas: home, matérias, categorias, busca e autores;
- Gutenberg sanitizado, URLs preservadas e fallback da origem;
- PromoGames Core para curadoria, preview e atualização imediata;
- SEO, analytics opcional, publicidade sem CLS e headers de segurança;
- 12 testes unitários, 13 cenários E2E efetivos e CI em GitHub Actions.

## Implantação

Esta release deixa o pacote pronto para staging. O cutover de DNS, os segredos e a instalação no WordPress devem seguir [DEPLOY-E-ROLLBACK.md](DEPLOY-E-ROLLBACK.md) e ser assinados com [QA-LANCAMENTO.md](QA-LANCAMENTO.md).
