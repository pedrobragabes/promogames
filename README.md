# PromoGames / JoystickNights — experiência editorial headless

Frontend editorial multissite. O piloto usa o conteúdo real do JoystickNights; depois do ensaio de cutover e rollback, o mesmo código recebe o backup fresco do PromoGames pela troca de perfil e origem. O WordPress continua sendo o CMS da redação; Next.js, React, TypeScript e Tailwind entregam a camada pública.

## O que está pronto

- home editorial responsiva com radar, destaques verticais e canais por plataforma;
- matérias nos permalinks atuais, com Gutenberg sanitizado, autoria, sumário, relacionados e comentários moderados;
- páginas, categorias aninhadas, tags, paginação, busca e arquivos de autores nas URLs legadas;
- estados de loading, erro, 404 e fallback da API;
- metadata, Open Graph, JSON-LD, sitemap e robots;
- Draft Mode e revalidação assinados;
- consentimento, analytics e AdSense opcionais sem carregamento anterior à escolha do leitor;
- plugin instalável **PromoGames Core 1.1** para campos editoriais, SEO TSF/SEOPress, curadoria, comentários assinados, preview e webhooks;
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
npm run check             # lint + TypeScript + testes unitários + build
npm run test:e2e          # build de produção + E2E em desktop/mobile
npm run audit:wordpress   # contrato da origem editorial
npm audit --omit=dev --audit-level=moderate
npm run verify:production -- https://seu-dominio
```

## Ambiente

| Variável | Escopo | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_PROFILE` | build/cliente | `joysticknights` no piloto; `promogames` na replicação |
| `WORDPRESS_API_URL` | servidor | REST API `/wp-json/wp/v2` |
| `WORDPRESS_USERNAME` | servidor | usuário técnico para preview |
| `WORDPRESS_APPLICATION_PASSWORD` | servidor | Application Password do WordPress |
| `WORDPRESS_COMMENTS_SECRET` | servidor | assinatura exclusiva do proxy de comentários |
| `DRAFT_MODE_SECRET` | servidor | entrada protegida do preview |
| `REVALIDATE_SECRET` | servidor | assinatura do webhook |
| `NEXT_PUBLIC_SITE_URL` | build/cliente | canonical, compartilhamento e sitemap |
| `NEXT_PUBLIC_GOOGLE_TAG_ID` | build/cliente | Google Tag opcional, após consentimento |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | build/cliente | publisher AdSense opcional, após consentimento |

Use [web/.env.example](web/.env.example) como referência e nunca versione valores reais.

## Documentação

- [Tutorial Hostinger do zero: JoystickNights e PromoGames](docs/TUTORIAL-HOSTINGER-DO-ZERO.md)
- [Plano de produto e arquitetura](docs/PLANO-REDESIGN-HEADLESS.md)
- [Contrato de conteúdo WordPress](docs/CONTRATO-WORDPRESS.md)
- [Deploy, DNS e rollback](docs/DEPLOY-E-ROLLBACK.md)
- [Guia seguro de migração headless e ensaio no JoystickNights](docs/GUIA-MIGRACAO-HEADLESS-SEGURO.md)
- [Runbook executável do piloto JoystickNights](docs/joysticknights-headless.md)
- [QA e checklist de lançamento](docs/QA-LANCAMENTO.md)
- [Instalação do PromoGames Core](wordpress/promogames-core/README.md)

O cutover recomendado mantém o WordPress isolado como origem editorial e permite retornar ao front legado sem perda de conteúdo.
