# PromoGames — plano de redesign e arquitetura headless

**Status:** proposta para validação

**Data:** 15 de julho de 2026

## 1. Decisão recomendada

Manter o WordPress como CMS editorial e construir um novo front-end público em **Next.js + React + TypeScript**, com componentes visuais próprios e Tailwind CSS apenas como ferramenta de estilização.

Isso significa:

- os redatores continuam entrando no WordPress, escrevendo, revisando, agendando e publicando como hoje;
- a home, as categorias, a busca, os autores e as matérias passam a ser renderizados pelo Next.js;
- o Elementor deixa de controlar o front público e fica apenas como legado durante a transição;
- não usar Shadcn UI nem outro kit visual pronto: o design system e os componentes serão próprios do PromoGames;
- manter os slugs atuais para não sacrificar SEO, links existentes e histórico do site.

### Resposta curta à principal dúvida

**Sim, continuamos no WordPress — mas não como tema público.** Ele continua sendo a redação e a base de conteúdo. O Next.js passa a ser a revista que o leitor vê.

Não recomendo que o usuário veja a home em Next.js e, ao clicar em uma notícia, seja mandado a uma página com aparência antiga do WordPress. Isso criaria duas identidades, dois sistemas de navegação, mudança visual brusca, duplicação de analytics e mais risco de SEO. Esse arranjo pode existir por poucos dias em uma prova de conceito, nunca como arquitetura final.

## 2. O que foi constatado no site atual

A auditoria foi somente leitura e usou páginas e endpoints públicos.

- O diretório local estava vazio no início deste plano; não existe código legado neste repositório.
- O site atual expõe normalmente a REST API nativa do WordPress em `/wp-json/wp/v2`.
- Os artigos recentes já são escritos com blocos do Gutenberg. Imagens, parágrafos, listas e subtítulos chegam como HTML semântico utilizável pelo novo front.
- A home atual é uma página `elementor_canvas` e retorna aproximadamente 69 mil caracteres de HTML renderizado.
- A taxonomia já possui bases úteis: Notícias, Análise, Promoção, Guias, PlayStation, Xbox, Nintendo, PC, Serviços, PlayStation Plus e Xbox Game Pass.
- O front atual combina Royal Elementor Kit, Elementor e Elementor Pro. O gargalo de customização está na camada visual, não no fluxo de produção dos artigos.

### Conclusão da auditoria

A separação desejada já existe parcialmente nos dados: **conteúdo editorial estruturado no WordPress, home fortemente acoplada ao Elementor**. Portanto, não é necessário migrar a redação para outro CMS nem reescrever matérias antigas. Reconstruímos a apresentação e consumimos o conteúdo existente.

## 3. Comparação das rotas possíveis

| Rota | Redação | Liberdade visual | Performance | Complexidade contínua | Veredito |
|---|---:|---:|---:|---:|---|
| WordPress + Elementor | ótima | baixa/média | média/baixa | baixa no começo, alta ao customizar | não resolve o gargalo |
| Tema WordPress próprio em PHP | ótima | alta | boa | média | alternativa válida, mas menos flexível para a experiência desejada |
| WordPress headless + Next.js | ótima | máxima | ótima | média | **recomendado** |
| CMS totalmente novo | piora no início | máxima | ótima | alta | custo sem benefício editorial agora |

Um tema PHP totalmente customizado é tecnicamente possível e mais simples de hospedar. Porém, para uma home muito interativa, componentes reutilizáveis, filtros, busca instantânea, previews e futuras ferramentas de jogos/preços, o Next.js oferece uma base mais coerente.

## 4. Princípio visual

O objetivo não é clonar a IGN. Devemos absorver os princípios que funcionam e reinterpretá-los com identidade própria.

### O que aproveitar da referência

- navegação lateral persistente no desktop;
- destaques em cartões verticais com imagem dominante;
- maior densidade editorial, exibindo mais histórias sem parecer um mosaico caótico;
- títulos fortes, curtos e legíveis;
- hierarquia clara entre notícia principal, destaques e fluxo recente;
- fundo claro para leitura e áreas escuras apenas onde criam impacto;
- interação rápida e discreta, sem carrosséis automáticos brigando com o leitor.

### O que não copiar

- logotipo, iconografia, cores ou proporções exatas da IGN;
- a mesma ordem de navegação ou composição idêntica dos módulos;
- dependência excessiva de cards sobrepostos;
- anúncios ou espaços vazios que dominem o conteúdo.

### Identidade proposta: “editorial elétrico”

- **Base:** off-white frio, branco e preto profundo.
- **Marca:** violeta elétrico derivado do logo atual.
- **Acento:** magenta/coral para notícias urgentes, CTAs e estados ativos.
- **Acento secundário:** amarelo quente usado com parcimônia em promoções e preços.
- **Tipografia:** uma sans variável expressiva para manchetes e uma sans muito legível para corpo. Sugestão inicial: Bricolage Grotesque ou Archivo para display; Inter ou Manrope para leitura.
- **Raios:** 10–14 px nos cards, evitando o excesso de cápsulas e cantos muito arredondados do visual atual.
- **Sombras:** quase inexistentes; profundidade vem de contraste, bordas e escala.

Tokens preliminares, ainda sujeitos ao protótipo:

```css
:root {
  --color-canvas: #f5f4f7;
  --color-surface: #ffffff;
  --color-ink: #121015;
  --color-muted: #6d6873;
  --color-line: #dedbe2;
  --color-brand: #6d28d9;
  --color-accent: #f02d7d;
  --color-deals: #ffb000;
  --radius-card: 12px;
}
```

## 5. Estrutura da nova home

### Desktop

1. **Sidebar fixa ou sticky, 232–256 px**
   - logo;
   - Início;
   - PlayStation, Xbox, Nintendo, PC;
   - Análises, Guias, Promoções e Serviços;
   - busca;
   - redes e mudança de tema no rodapé.

2. **Barra “Agora no Radar”**
   - três a cinco assuntos curtos: lançamento, rumor importante, promoção ou atualização;
   - rolagem horizontal no mobile;
   - sem animação automática invasiva.

3. **Palco de destaques verticais**
   - quatro cartões 4:5 ou 3:4;
   - o principal recebe um pouco mais de largura;
   - imagem em toda a área, gradiente inferior, categoria e manchete;
   - no máximo três linhas de título;
   - hover com zoom de imagem muito leve e elevação de 2–4 px.

4. **Mais destaques**
   - grid editorial de quatro colunas no desktop;
   - imagem 16:9, categoria, título e data;
   - cards sem grandes caixas brancas, para reduzir peso visual.

5. **Faixas de conteúdo próprias do PromoGames**
   - “Últimas notícias” em lista cronológica;
   - “Reviews” com nota e plataforma;
   - “Vale o seu dinheiro?” para promoções e serviços;
   - “Guias rápidos”;
   - “Calendário da semana”;
   - newsletter e redes no final.

### Mobile

- header compacto no topo, com menu em drawer;
- destaques verticais em scroll horizontal com CSS scroll snap;
- uma coluna para o fluxo de notícias;
- alvos de toque confortáveis e foco visível;
- imagens dimensionadas para evitar saltos de layout;
- nenhum conteúdo essencial depende de hover ou gesto de arrastar.

## 6. Página de matéria

A matéria também deve estar no Next.js. O WordPress fornece os dados; o Next decide como apresentá-los.

### Estrutura

1. breadcrumb discreto;
2. categoria principal e plataformas;
3. título com largura controlada;
4. subtítulo/deck;
5. autor, data, atualização e tempo de leitura;
6. imagem de capa 16:9;
7. corpo com coluna de aproximadamente 720–780 px;
8. compartilhamento sticky apenas quando houver espaço;
9. sumário opcional para guias e matérias longas;
10. bloco do autor;
11. matérias relacionadas e próxima leitura;
12. espaços publicitários com altura reservada para evitar CLS.

### Compatibilidade com o conteúdo atual

O `content.rendered` do WordPress já contém classes como `wp-block-image` e `wp-block-list`. A primeira versão pode renderizar esse HTML confiável no servidor com uma folha de estilos própria para blocos Gutenberg. Depois, blocos especiais podem ser transformados em componentes React, por exemplo:

- galeria;
- vídeo responsivo;
- caixa de ficha técnica;
- nota de review;
- aviso de spoiler;
- produto/preço;
- fonte e correções.

Elementor não deve ser usado para escrever matérias novas. Ele pode permanecer somente em páginas legadas enquanto elas são reconstruídas.

## 7. Arquitetura técnica

```text
Redator
  -> WordPress Admin / Gutenberg
      -> REST API do WordPress
          -> camada de dados tipada do Next.js
              -> cache/ISR
                  -> home, categorias, busca, autores e matérias

Publicação/atualização no WordPress
  -> webhook assinado
      -> /api/revalidate no Next.js
          -> invalida a matéria e os feeds afetados
```

### Stack proposta

- Next.js com App Router;
- React + TypeScript estrito;
- Tailwind CSS para tokens, layout e responsividade;
- CSS próprio para tipografia editorial, blocos Gutenberg e interações especiais;
- componentes desenhados do zero, sem Shadcn UI;
- testes de unidade para a camada de dados e Playwright para fluxos críticos;
- ESLint e formatação automatizada;
- Storybook é opcional e só entra se o número de componentes justificar a manutenção.

### API: começar com REST, não GraphQL

A REST API nativa já está ativa e cobre posts, páginas, categorias, tags, autores e mídia. Para o MVP, ela reduz dependências e é suficiente.

Usaremos:

- `_fields` para não transferir campos desnecessários;
- `_embed` para mídia, autor e termos quando reduzir viagens de rede;
- chamadas exclusivamente no servidor sempre que possível;
- tipos internos estáveis, para não espalhar o formato cru do WordPress pela interface;
- cache por tags e revalidação sob demanda ao publicar.

WPGraphQL pode ser reavaliado quando a home possuir muitos módulos configuráveis ou o modelo de conteúdo ficar profundamente relacional. Não é necessário adicioná-lo agora.

### Campos editoriais que faltam

Criar um pequeno plugin próprio, provisoriamente chamado **PromoGames Core**, para registrar campos e endpoints que pertencem ao produto, não ao tema:

- subtítulo/deck;
- categoria principal;
- plataformas;
- tipo editorial: notícia, review, guia, promoção, opinião;
- nota de review;
- jogo, publisher e data de lançamento quando aplicável;
- conteúdo patrocinado;
- destaque na home e validade do destaque;
- prioridade/posição editorial;
- webhook de revalidação;
- URL de preview do Next.js.

Para o protótipo, a home pode usar os posts mais recentes. Antes da produção, deve existir uma tela simples de **Curadoria da Home**, permitindo escolher e ordenar os cartões sem abrir o Elementor.

### Estrutura sugerida do front-end

```text
src/
  app/
    (site)/
      page.tsx
      [slug]/page.tsx
      categoria/[slug]/page.tsx
      autor/[slug]/page.tsx
      buscar/page.tsx
    api/
      draft/route.ts
      revalidate/route.ts
  components/
    editorial/
      hero-deck.tsx
      portrait-story-card.tsx
      story-card.tsx
      story-list-item.tsx
      article-body.tsx
    navigation/
      desktop-sidebar.tsx
      mobile-header.tsx
      search-dialog.tsx
    advertising/
      ad-slot.tsx
  lib/
    wordpress/
      client.ts
      queries.ts
      mappers.ts
      types.ts
  styles/
    globals.css
    gutenberg.css
```

## 8. URLs, hospedagem e corte de produção

### Topologia recomendada

- `promogamesbr.com`: front Next.js;
- `cms.promogamesbr.com`: WordPress Admin e origem da API;
- manter URLs públicas de artigos no domínio principal;
- manter uploads antigos acessíveis e, se necessário, servir/proxyar `/wp-content/uploads` sem trocar as URLs de uma vez.

Uma alternativa com menos mudanças de origem é usar um reverse proxy:

- rotas públicas vão para Next.js;
- `/wp-admin`, `/wp-login.php`, `/wp-json` e `/wp-content/uploads` vão para a instalação WordPress.

Essa alternativa mantém tudo no mesmo domínio, mas exige configuração cuidadosa no proxy/CDN.

### Estratégia segura de lançamento

1. desenvolver em `beta.promogamesbr.com`, lendo a API de produção em modo público;
2. não alterar a home atual durante o protótipo;
3. concluir no beta pelo menos home, matéria, categoria, busca e página 404;
4. comparar slugs, metadados e sitemap com o site atual;
5. configurar preview editorial e revalidação;
6. congelar mudanças de layout por uma janela curta;
7. trocar o roteamento/DNS;
8. monitorar 404, indexação, analytics e Core Web Vitals;
9. manter rollback simples para o WordPress durante os primeiros dias.

## 9. SEO e analytics são requisitos de lançamento

- preservar todos os slugs atuais;
- gerar canonical correto;
- gerar metadata dinâmica por matéria;
- Open Graph e Twitter cards;
- JSON-LD de `NewsArticle`/`Article`, breadcrumb e autor;
- sitemap de matérias, páginas, categorias e autores relevantes;
- redirecionamento 301 para qualquer URL realmente alterada;
- `robots.txt` do front público e `noindex` na origem do CMS;
- portar GA4/GTM e consentimento para o Next.js — o Site Kit do WordPress não cobre automaticamente o novo front;
- reservar dimensões de imagens e anúncios;
- monitorar erros de API e falhas de revalidação.

## 10. Performance e acessibilidade

Metas de campo no percentil 75:

- LCP menor ou igual a 2,5 s;
- INP menor ou igual a 200 ms;
- CLS menor ou igual a 0,1;
- conformidade WCAG 2.2 nível AA como alvo do produto.

Decisões práticas:

- Server Components por padrão;
- JavaScript cliente apenas em busca, menu, filtros e interações reais;
- imagens responsivas e formatos modernos;
- fontes self-hosted e subconjuntos mínimos;
- sem autoplay na área principal;
- `prefers-reduced-motion` respeitado;
- foco de teclado visível;
- contraste validado nos gradientes sobre imagens;
- carrosséis operáveis por teclado, toque e controles explícitos.

## 11. Funcionalidades por fase

### MVP — necessário para substituir o front atual

- home responsiva;
- matéria completa;
- categorias e paginação;
- autores;
- busca;
- menu desktop/mobile;
- páginas institucionais essenciais;
- preview de rascunho;
- revalidação ao publicar;
- SEO, sitemap, 404 e redirects;
- analytics e slots de anúncios;
- dark mode apenas se for uma decisão de marca, não como distração do MVP.

### Fase seguinte — diferenciação do PromoGames

- curadoria visual da home no WordPress;
- páginas de jogos com ficha técnica;
- calendário de lançamentos;
- central de reviews e notas;
- acompanhamento de promoções/preços;
- filtros por plataforma;
- “leia em 1 minuto” com resumo editorial;
- newsletter segmentada;
- favoritos sem conta, usando armazenamento local;
- alertas e personalização apenas quando houver dados que justifiquem.

## 12. Roadmap sugerido

As durações abaixo são faixas para uma pessoa desenvolvendo com feedback rápido; não são compromisso fechado.

### Fase 0 — auditoria e fundação (1–3 dias)

- inventário de plugins, páginas, slugs e integrações;
- exportar mapa de URLs;
- confirmar hospedagem, CDN, analytics e anúncios;
- configurar repositório, lint, testes e ambientes.

**Saída:** risco de migração conhecido e base executável.

### Fase 1 — protótipo visual conectado ao WordPress (3–6 dias)

- design tokens;
- sidebar e header mobile;
- quatro destaques verticais;
- grid “Mais destaques”;
- uma matéria real renderizada da API;
- responsividade de desktop a mobile.

**Saída:** protótipo navegável em beta com conteúdo real, suficiente para decidir a direção visual.

### Fase 2 — produto editorial MVP (1–2 semanas)

- categorias, busca, autores e paginação;
- template completo de matéria;
- blocos Gutenberg e relacionados;
- estados de loading, erro e vazio;
- acessibilidade e testes principais.

**Saída:** cobertura funcional equivalente ao site atual.

### Fase 3 — integração editorial e SEO (4–8 dias)

- PromoGames Core;
- curadoria da home;
- preview de rascunhos;
- webhook de revalidação;
- metadata, JSON-LD, sitemap, redirects e analytics.

**Saída:** fluxo de publicação pronto para a equipe.

### Fase 4 — QA e lançamento (3–5 dias)

- comparação visual e de URLs;
- teste com redatores;
- performance de produção;
- corte de tráfego e observabilidade;
- plano de rollback.

**Saída:** novo front público com WordPress preservado como CMS.

## 13. Critérios de aceite do primeiro protótipo

O protótipo só está aprovado se:

- usar posts reais do PromoGames, não lorem ipsum;
- a home parecer uma marca própria, não um template de notícias;
- os destaques verticais funcionarem em desktop e mobile;
- uma matéria atual renderizar texto, listas e imagens corretamente;
- o título não dominar toda a tela como no hero atual;
- a navegação for utilizável por teclado;
- não houver dependência de Shadcn UI;
- a equipe conseguir imaginar o fluxo real de publicação sem mudar sua rotina.

## 14. Riscos e contenções

| Risco | Contenção |
|---|---|
| Plugins inserem shortcodes ou HTML específico em matérias antigas | inventário de blocos/shortcodes e fallback de renderização |
| Mudança de URLs prejudica tráfego orgânico | preservar slugs, mapear URLs e testar redirects antes do corte |
| Post publicado demora a aparecer | webhook assinado + revalidação por caminho/tag + revalidação temporal de segurança |
| WordPress fica indisponível | páginas públicas continuam em cache; monitorar origem e servir última versão válida |
| Elementor continua sendo usado em conteúdo novo | definir Gutenberg como fluxo oficial e restringir Elementor a legado |
| Novo front vira um app pesado | Server Components, orçamento de JavaScript e testes de performance |
| Curadoria depende de deploy | tela de curadoria no WordPress e campos expostos pela API |
| Duas versões públicas são indexadas | `noindex` no beta e no domínio do CMS; canonical no domínio principal |

## 15. Próxima decisão

Começar pela **Fase 1: protótipo visual conectado ao WordPress atual**.

O primeiro corte deve conter apenas:

1. shell responsivo (sidebar desktop + header mobile);
2. home com destaques verticais e “Mais destaques”;
3. página de matéria consumindo um artigo real;
4. tokens e componentes próprios;
5. dados vindos da REST API pública existente.

Depois de validar essa direção visual, implementamos a curadoria e a integração editorial avançada. Isso evita investir cedo em infraestrutura antes de termos certeza de que o novo PromoGames realmente encontrou sua cara.

## 16. Referências técnicas

- [WordPress REST API — referência oficial](https://developer.wordpress.org/rest-api/reference/)
- [WordPress REST API — parâmetros globais `_fields` e `_embed`](https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/)
- [Next.js — Incremental Static Regeneration](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [Next.js — Draft Mode para CMS headless](https://nextjs.org/docs/app/guides/draft-mode)
- [Next.js — metadata e Open Graph](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [WPGraphQL — documentação oficial](https://www.wpgraphql.com/docs/introduction)
- [web.dev — Core Web Vitals](https://web.dev/articles/vitals)
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/)
