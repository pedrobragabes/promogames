# PromoGames Web

Front-end headless do PromoGames, construído com Next.js, React, TypeScript e Tailwind CSS. O WordPress permanece como CMS editorial.

## Desenvolvimento

```bash
cp .env.example .env.local
npm install
npm run dev
```

A aplicação fica em `http://localhost:3000`.

## Validação

```bash
npm run audit:wordpress
npm run lint
npm run typecheck
npm run build
```

## Variáveis

Consulte `.env.example`. Apenas variáveis prefixadas por `NEXT_PUBLIC_` chegam ao navegador; segredos de preview e revalidação permanecem no servidor.

## Arquitetura

- `src/app`: rotas App Router;
- `src/components`: componentes visuais próprios;
- `src/lib/wordpress`: cliente REST, tipos, mappers e fallbacks;
- `scripts/audit-wordpress.mjs`: verificação do contrato público.

O contrato detalhado está em `../docs/CONTRATO-WORDPRESS.md`.
