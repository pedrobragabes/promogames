# PromoGames — nova experiência editorial

Este repositório será a base do novo front-end do PromoGames.

O plano inicial de produto, design e arquitetura está em:

- [Plano de redesign e arquitetura headless](docs/PLANO-REDESIGN-HEADLESS.md)

Decisão proposta: manter o WordPress como CMS dos redatores e construir toda a experiência pública em Next.js, consumindo inicialmente a REST API já disponível no site atual.

## Estrutura

- `web/`: aplicação pública em Next.js;
- `wordpress/`: integração editorial instalável no WordPress;
- `docs/`: decisões, contrato de conteúdo e operação.

## Começar

```bash
cd web
npm install
npm run dev
```

Use `npm run check` para validar lint, TypeScript e build de produção.
