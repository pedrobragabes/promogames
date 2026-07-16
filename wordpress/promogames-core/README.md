# PromoGames Core

Plugin instalável que mantém a integração headless fora do tema e do Elementor.

## Instalação

1. Copie `wordpress/promogames-core` para `wp-content/plugins/promogames-core`.
2. Ative **PromoGames Core** no painel.
3. Crie um usuário técnico com Application Password para leitura de rascunhos.
4. Adicione ao `wp-config.php`, antes de `/* That's all, stop editing! */`:

```php
define('PROMOGAMES_FRONTEND_URL', 'https://novo.promogamesbr.com');
define('PROMOGAMES_PREVIEW_SECRET', 'use-um-segredo-longo-e-unico');
define('PROMOGAMES_REVALIDATE_URL', 'https://novo.promogamesbr.com/api/revalidate/');
define('PROMOGAMES_REVALIDATE_SECRET', 'use-outro-segredo-longo-e-unico');
```

Os valores precisam corresponder a `DRAFT_MODE_SECRET` e `REVALIDATE_SECRET` do Next.js. Nunca versione os segredos reais.

## Contrato

- Metacampos REST: `promogames_deck`, `promogames_editorial_type`, `promogames_platforms`, `promogames_review_score`, `promogames_featured` e `promogames_featured_order`.
- Curadoria pública: `GET /wp-json/promogames/v1/home?per_page=4`.
- Preview: o botão do WordPress abre `/api/draft/` com ID e segredo; o Next valida o post usando Application Password.
- Publicação/edição/lixeira: o plugin dispara um webhook assinado para limpar tags e rotas. O front mantém revalidação temporal de 5 minutos como fallback.

## Segurança

Todos os campos passam por sanitização; a gravação exige nonce e `edit_post`; os segredos ficam somente nas configurações de ambiente; a URL de destino do preview é derivada do post retornado pela API, evitando open redirect.
