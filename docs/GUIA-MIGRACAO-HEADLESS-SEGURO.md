# Guia seguro de migração WordPress headless

**Projeto principal:** PromoGames

**Ensaio recomendado:** JoystickNights

**Última verificação local:** 22 de julho de 2026

## Decisão

Não recomeçar o PromoGames e não substituir o WordPress por outro CMS agora.

A arquitetura recomendada é:

- WordPress como painel editorial, usuários, banco, mídia e integrações;
- Next.js como site público, identidade visual e experiência de leitura;
- domínio principal apontando para o Next.js;
- WordPress isolado em `cms.dominio.com`;
- staging em `beta.dominio.com` antes de qualquer corte de produção.

O JoystickNights deve ser usado como ensaio completo porque é um projeto próprio e aceita uma janela maior de indisponibilidade. O ensaio só é considerado concluído depois de executar também o rollback. Depois disso, repetir o procedimento no PromoGames com uma janela editorial curta.

## Estado validado do PromoGames

Em 22 de julho de 2026:

- o frontend está marcado como `v1.0.0`;
- ESLint, TypeScript, 12 testes unitários e o build de produção passaram localmente;
- o build gerou 44 páginas e handlers;
- a REST API pública retornou 545 posts, 14 categorias e 9 usuários;
- o backup local contém 9 usuários, 491 posts publicados, 1.195 attachments e 13.660 registros de postmeta;
- `wp-content` possui aproximadamente 3,6 GiB e 26.875 arquivos;
- existem 8.304 arquivos dentro de uploads;
- o SQL local possui aproximadamente 113 MB;
- o WordPress antigo usa core 6.8.5;
- o WordPress limpo em `wordpress/wordpress` usa core 7.0.2.

O SQL local está pelo menos 54 posts atrás do site ao vivo. Ele serve para ensaio e investigação, mas **não pode ser usado como backup final do cutover**.

## O que é preservado e o que precisa ser reintegrado

| Item | Preservação | Procedimento ou limitação |
|---|---|---|
| Usuários e hashes de senha | Sim | Restaurar `wp_users` e `wp_usermeta` pelo banco completo. |
| Sessões já abertas | Não garantido | Mudança de domínio, cookies ou salts pode exigir novo login. |
| Posts, páginas, termos e autores | Sim | O banco WordPress continua sendo a fonte de verdade. |
| Imagens e anexos | Sim | Copiar `wp-content/uploads` e preservar ou reescrever as URLs. |
| Plugins e temas | Arquivos e configurações, sim | Hooks que imprimem HTML no frontend WordPress não são executados pelo Next.js. |
| Google Analytics e Search Console | Histórico, sim | O histórico fica na conta Google; a coleta precisa ser instalada no Next.js. |
| SEO e slugs | Sim | Preservar slugs, canonical e criar redirects para URLs alteradas. |
| Login administrativo | Sim | O painel passa a ser acessado pelo domínio do CMS. |
| Login público de leitores | Ainda não | O frontend atual não implementa autenticação pública. |
| Newsletter e anúncios | Ainda não | A interface existe, mas o envio e o provedor de anúncios não estão integrados. |

## Plugins encontrados no backup

Os plugins ativos incluem ACF, Elementor, Elementor Pro, Site Kit, LiteSpeed Cache, Omnisend, Royal Elementor Addons, WP Mail SMTP, SEOPress, WPForms Lite, Code Snippets e plugins da Hostinger.

Classificação inicial:

- **Preservar no CMS:** ACF, WP Mail SMTP e os plugins necessários ao fluxo editorial.
- **Auditar antes de manter:** Code Snippets, WPForms, Omnisend, Site Kit e SEOPress.
- **Manter durante a transição:** Elementor, Elementor Pro e Royal Elementor Addons, pois páginas legadas ainda podem depender deles.
- **Reavaliar depois do corte:** LiteSpeed Cache e plugins de frontend/onboarding da Hostinger, porque o site público não será renderizado pelo WordPress.

Existem snippets ativos para bio e redes sociais dos autores. O Next.js atual consome nome, descrição e avatar, mas não reproduz todos esses campos sociais. Não desativar o plugin antes de mapear os dados e o comportamento.

## Lacunas do frontend antes da produção

O núcleo de notícias funciona, mas a paridade ainda não está completa:

1. O Next consulta posts, mas não páginas WordPress. As páginas atuais `/contact/`, `/guias/`, `/analises/` e `/noticias/` precisam ser implementadas ou redirecionadas.
2. O plugin PromoGames Core expõe curadoria da home, mas a home ainda usa os posts mais recentes.
3. A newsletter possui somente interface; o formulário não envia dados para um provedor.
4. Os espaços de anúncio reservam layout, mas ainda não carregam uma rede de anúncios.
5. Site Kit, Omnisend, WPForms, SEOPress e outros plugins que usam `wp_head` ou `wp_footer` não injetam código no Next.js.
6. As imagens antigas usam `promogamesbr.com/wp-content/uploads`. Depois do corte, é necessário reescrever para `cms.promogamesbr.com`, usar CDN ou criar proxy explícito.
7. O frontend não oferece login público, comentários ou área de usuário.
8. O arquivo `.env.example` possui nomes duplicados/legados e deve ser limpo antes de cadastrar as variáveis de produção.

## Topologia recomendada

```text
Leitor
  -> promogamesbr.com
      -> Next.js
          -> cms.promogamesbr.com/wp-json/...

Redator
  -> cms.promogamesbr.com/wp-admin
      -> WordPress / Gutenberg
          -> webhook assinado do Next.js
```

No ensaio, substituir pelos domínios do JoystickNights:

- `joysticknights.com`: frontend final;
- `cms.joysticknights.com`: WordPress;
- `beta.joysticknights.com`: frontend de teste.

## Procedimento de restauração do CMS

### 1. Proteger os originais

- manter duas cópias independentes do SQL e de `wp-content`;
- registrar tamanho e hash dos arquivos de backup;
- não trabalhar diretamente sobre a única cópia;
- nunca versionar SQL, `wp-config.php`, uploads, chaves ou arquivos `.env`;
- não enviar credenciais por chat, issue ou pull request.

### 2. Criar o staging

- criar banco e usuário MySQL exclusivos para staging;
- usar core WordPress limpo da mesma versão da origem;
- criar um `wp-config.php` novo, com credenciais novas e o mesmo prefixo de tabelas;
- importar o banco completo;
- copiar `wp-content`, preservando plugins, temas e uploads;
- copiar somente arquivos especiais da raiz depois de auditá-los;
- proteger staging com senha e `noindex`;
- impedir e-mails, webhooks comerciais e automações reais durante o ensaio.

Não copiar cegamente o core antigo. Também não importar o banco 6.8.5 diretamente no WordPress 7.0.2 de produção.

### 3. Ajustar o domínio corretamente

Usar WP-CLI ou ferramenta que compreenda dados serializados:

```bash
wp search-replace 'https://dominio.com' 'https://cms.dominio.com' --all-tables --precise --dry-run
wp search-replace 'https://dominio.com' 'https://cms.dominio.com' --all-tables --precise
```

Nunca fazer `replace` textual diretamente no SQL: opções e metadados serializados podem ser corrompidos.

Depois da troca:

- salvar novamente os permalinks;
- limpar caches;
- confirmar login e troca de senha;
- abrir posts antigos e recentes;
- verificar miniaturas e imagens dentro do corpo;
- testar REST API, cron, SMTP e Application Passwords.

### 4. Atualizar em etapas

1. Snapshot do staging funcionando na versão original.
2. Atualizar plugins compatíveis em grupos pequenos.
3. Testar painel e REST depois de cada grupo.
4. Atualizar o core WordPress.
5. Testar novamente.
6. Instalar e ativar PromoGames Core.
7. Criar usuário técnico de menor privilégio e Application Password exclusiva.

Elementor Pro, serviços Google e outros produtos podem exigir nova autenticação ou ajuste de licença no subdomínio.

## Ensaio obrigatório no JoystickNights

O objetivo não é apenas colocar o site no ar. É provar que o procedimento completo é repetível.

### Critérios de sucesso

- restauração do banco e uploads concluída;
- mesmos usuários conseguem entrar;
- posts, páginas, autores, mídia e slugs conferem;
- WordPress funciona em `cms`;
- Next.js funciona em `beta` consumindo dados reais;
- publicação e edição atualizam o frontend;
- analytics aparece em tempo real;
- e-mail e formulários chegam ao destino correto;
- sitemap, robots, canonical e redirects estão corretos;
- corte do domínio executado;
- rollback executado e cronometrado;
- novo corte executado depois do rollback.

Registrar comandos, telas do hPanel, tempos e problemas encontrados. O PromoGames deve reutilizar esse roteiro corrigido, não improvisar um segundo procedimento.

## Cutover do PromoGames

### Antes

- confirmar plano Hostinger, suporte a Node.js e limites de recursos;
- exportar zona DNS e registrar IPs/targets atuais;
- baixar backup novo de arquivos e banco pelo hPanel;
- gerar também exportação manual do banco;
- sincronizar uploads recentes;
- baixar TTL para 300 segundos com antecedência;
- validar `beta` com `noindex`;
- listar responsáveis e critério objetivo de rollback;
- definir janela curta sem publicação editorial para a sincronização final.

### Durante

1. Fazer dump final do banco de produção.
2. Sincronizar uploads alterados.
3. Importar no CMS definitivo.
4. Validar contagem do acervo e o post mais recente.
5. Confirmar painel, REST e HTTPS do CMS.
6. Publicar o deployment final do Next.js sem mudar DNS.
7. Rodar smoke test pelo endereço temporário.
8. Alterar DNS ou roteamento.
9. Testar home, categorias, busca, autores, páginas e três matérias reais.
10. Publicar uma matéria de teste e confirmar revalidação.
11. Confirmar GA Realtime, imagens, formulários e logs.

### Depois

- monitorar erros 404 e 5xx;
- verificar Search Console e sitemap;
- acompanhar imagens quebradas e URLs antigas;
- não apagar o WordPress legado nem backups durante o período de estabilização;
- manter a equipe informada sobre o caminho de rollback.

## Rollback

O rollback não deve depender de restaurar um banco durante o incidente.

1. Definir antes do corte qual deployment/DNS representa o frontend legado.
2. Se houver falha grave, interromper mudanças e registrar horário.
3. Reverter o domínio para o WordPress legado ou promover o deployment anterior.
4. Restaurar regras de `/wp-content` e `/wp-json`, se tiverem sido alteradas.
5. Rodar smoke test no site restaurado.
6. Manter o CMS e o conteúdo publicados; não apagar banco, uploads ou commits.
7. Investigar a causa antes de tentar novo corte.

Meta operacional sugerida: decisão em até 5 minutos e restauração do frontend em até 15 minutos depois da decisão.

## Cuidados específicos da Hostinger

A Hostinger suporta aplicações Node.js/Next.js em planos Business e Cloud, mas o plano exato deve ser confirmado no hPanel.

Não remover o site WordPress atual para transformar imediatamente o domínio raiz em aplicação Node.js. A remoção de um website pelo hPanel pode apagar arquivos, banco, e-mail e configuração. Criar primeiro um app separado ou usar outro provedor para o frontend reduz o risco.

O recurso de staging da Hostinger é útil para testes, mas a ação de publicar staging substitui arquivos e banco da produção. Não usá-la como mecanismo automático de lançamento do headless.

Referências:

- https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- https://www.hostinger.com/support/5720286-how-to-create-a-wordpress-staging-environment-in-hostinger/
- https://www.hostinger.com/support/4283700-how-to-restore-backups-at-hostinger/

## Retomada em outra máquina

```powershell
git clone <url-do-repositorio>
Set-Location promogames\web
npm ci
npm run audit:wordpress
npm run check
```

Não copiar `.env` pelo Git. Recriar as variáveis pelo gerenciador de segredos do provedor:

- `WORDPRESS_API_URL`;
- `WORDPRESS_USERNAME`;
- `WORDPRESS_APPLICATION_PASSWORD`;
- `DRAFT_MODE_SECRET`;
- `REVALIDATE_SECRET`;
- `NEXT_PUBLIC_SITE_URL`;
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

Antes de qualquer push:

```powershell
git status --short
git check-ignore -v promogamesold\domains\u817360053_W0atj.sql
git check-ignore -v promogamesold\domains\promogamesbr.com\public_html\wp-config.php
git diff --cached --name-only
```

Nunca usar `git add .` sem conferir o status. Para mudanças pequenas, adicionar caminhos explícitos.

## Próxima sequência recomendada

1. Executar este roteiro no JoystickNights.
2. Documentar as diferenças reais do hPanel.
3. Corrigir o roteiro depois do rollback ensaiado.
4. Fechar as lacunas funcionais do frontend PromoGames.
5. Gerar backup fresco do PromoGames.
6. Criar CMS e beta definitivos.
7. Fazer QA editorial, SEO, analytics e integrações.
8. Executar o cutover com rollback pronto.

Este guia complementa `PLANO-REDESIGN-HEADLESS.md`, `CONTRATO-WORDPRESS.md`, `DEPLOY-E-ROLLBACK.md` e `QA-LANCAMENTO.md`.
