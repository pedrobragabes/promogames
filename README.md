# PromoGames — experiência editorial headless

Versão 1.0 do novo front público do PromoGames. O WordPress continua sendo o CMS confortável da redação; Next.js, React, TypeScript e Tailwind entregam a experiência visual própria para o leitor.

## O que está pronto

- home editorial responsiva com radar, destaques verticais e canais por plataforma;
- matérias nos slugs atuais, com Gutenberg sanitizado, autoria, sumário e relacionados;
- categorias, paginação, busca e arquivos de autores;
- estados de loading, erro, 404 e fallback da API;
- metadata, Open Graph, JSON-LD, sitemap e robots;
- Draft Mode e revalidação assinados;
- analytics opcional e slots de publicidade sem CLS;
- plugin instalável **PromoGames Core** para os campos e webhooks editoriais;
- CI, testes unitários, E2E desktop/mobile e documentação de rollback.

Não há Shadcn UI ou kit visual pronto. A identidade e os componentes são próprios.

## Estrutura

- `web/`: aplicação Next.js;
- `wordpress/promogames-core/`: plugin editorial instalável;
- `docs/`: plano, contrato WordPress, QA e operação;
- `.github/workflows/ci.yml`: quality gate do repositório.

## Desenvolvimento

Requer Node.js 22 (mínimo suportado pelo Next.js: 20.9).

```bash
cd web
npm ci
copy .env.example .env.local
npm run dev
```

Comandos principais:

```bash
npm run check             # lint + TypeScript + 12 testes unitários + build
npm run test:e2e          # build de produção + E2E em desktop/mobile
npm run audit:wordpress   # contrato da origem editorial
npm audit --audit-level=moderate
npm run verify:production -- https://seu-dominio
```

## Ambiente

| Variável | Escopo | Uso |
|---|---|---|
| `WORDPRESS_API_URL` | servidor | REST API `/wp-json/wp/v2` |
| `WORDPRESS_USERNAME` | servidor | usuário técnico para preview |
| `WORDPRESS_APPLICATION_PASSWORD` | servidor | Application Password do WordPress |
| `DRAFT_MODE_SECRET` | servidor | entrada protegida do preview |
| `REVALIDATE_SECRET` | servidor | assinatura do webhook |
| `NEXT_PUBLIC_SITE_URL` | build/cliente | canonical, compartilhamento e sitemap |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | build/cliente | Google Analytics opcional |

Use [web/.env.example](web/.env.example) como referência e nunca versione valores reais.

## Documentação

- [Plano de produto e arquitetura](docs/PLANO-REDESIGN-HEADLESS.md)
- [Contrato de conteúdo WordPress](docs/CONTRATO-WORDPRESS.md)
- [Deploy, DNS e rollback](docs/DEPLOY-E-ROLLBACK.md)
- [Guia seguro de migração headless e ensaio no JoystickNights](docs/GUIA-MIGRACAO-HEADLESS-SEGURO.md)
- [QA e checklist de lançamento](docs/QA-LANCAMENTO.md)
- [Instalação do PromoGames Core](wordpress/promogames-core/README.md)

O cutover recomendado mantém o WordPress isolado como origem editorial e permite retornar ao front legado sem perda de conteúdo.
