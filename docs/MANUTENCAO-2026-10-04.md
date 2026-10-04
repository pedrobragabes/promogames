# Manutenção da base principal

A `main` do repositório PromoGames estava em Next/ESLint Next 16.2.11, React 19.2.4 e overrides antigos. A consulta inicial do npm audit encontrou 16 alertas, incluindo um crítico. Esta manutenção usa Next/ESLint Next 16.3.8, React 19.2.8, sanitize-html 2.17.7 e patches compatíveis de sharp, PostCSS, Vitest e ferramentas transitivas.

O audit de produção passou a zero. O audit completo ainda registra cinco alertas high na cadeia de braces usada pelas ferramentas de lint; a resolução sugerida que troca a major do ESLint Next não foi aplicada. O lockfile permanece reproduzível com `npm ci`.

O CI deixa de depender da disponibilidade do CMS público. Uma API REST sintética, somente leitura, em loopback fornece 56 publicações, categorias, página e autor. Ela existe exclusivamente em `web/scripts/wordpress-ci-fixture.mjs`, não é importada pela aplicação e recusa escritas. O código de produção continua usando a origem configurada. A geração estática limita a uma página por worker e até dois workers.

## Evidência local

- Lint, tipos e 35 testes unitários aprovados.
- Build de produção concluído pelo webServer do Playwright.
- 19 E2E Chromium desktop/mobile aprovados; um cenário exclusivo de mobile ignorado no desktop.
- Audit de produção sem vulnerabilidades conhecidas na consulta.

O CI deve repetir essas verificações e o lint PHP antes da integração. A suíte sintética não comprova paridade do acervo real, configuração do plugin, preview autenticado no WordPress, processamento de comentários, instalação Hostinger, cutover ou rollback operacional.

## Comparação com o trabalho local

A modernização de setembro continua em `02-Conteudo/JoystickNights-WIP`, branch `codex/promogames-modernizacao`, sem commit dos arquivos alterados. Ela contém home de comunidade, área Notícias, marca/arte, navegação e outras mudanças de frontend e plugin. Esta manutenção não substitui nem importa esse conteúdo automaticamente. A referência documental é `docs/PROMOGAMES-MODERNIZACAO-2026-09-23.md` naquele checkout; a reconciliação de funcionalidade precisa conservar ambos os perfis e os testes antes de qualquer integração.

Os quatro milestones de migração permanecem abertos: precisam de backup recente, CMS/beta, credenciais distintas, validação de URLs/mídia, DNS e ensaio de rollback. Não houve publicação, troca de domínio, alteração do WordPress ou geração de notícias.
