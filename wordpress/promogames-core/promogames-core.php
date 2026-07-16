<?php
/**
 * Plugin Name: PromoGames Core
 * Description: Integração editorial headless do PromoGames: metacampos, curadoria, preview e revalidação.
 * Version: 1.0.0
 * Author: PromoGames
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * Text Domain: promogames-core
 */

if (!defined('ABSPATH')) {
    exit;
}

const PROMOGAMES_CORE_VERSION = '1.0.0';

/**
 * Registra os metacampos que formam o contrato editorial do front headless.
 */
function promogames_core_register_meta(): void
{
    $common = [
        'object_subtype' => 'post',
        'single' => true,
        'auth_callback' => static fn (): bool => current_user_can('edit_posts'),
    ];

    register_post_meta('post', 'promogames_deck', $common + [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_textarea_field',
        'show_in_rest' => ['schema' => ['type' => 'string']],
    ]);
    register_post_meta('post', 'promogames_editorial_type', $common + [
        'type' => 'string',
        'sanitize_callback' => 'promogames_core_sanitize_editorial_type',
        'show_in_rest' => ['schema' => ['type' => 'string', 'enum' => ['noticia', 'analise', 'guia', 'promocao']]],
    ]);
    register_post_meta('post', 'promogames_platforms', $common + [
        'type' => 'array',
        'default' => [],
        'sanitize_callback' => 'promogames_core_sanitize_platforms',
        'show_in_rest' => ['schema' => ['type' => 'array', 'items' => ['type' => 'string']]],
    ]);
    register_post_meta('post', 'promogames_review_score', $common + [
        'type' => 'number',
        'sanitize_callback' => 'promogames_core_sanitize_score',
        'show_in_rest' => ['schema' => ['type' => 'number', 'minimum' => 0, 'maximum' => 10]],
    ]);
    register_post_meta('post', 'promogames_featured', $common + [
        'type' => 'boolean',
        'default' => false,
        'sanitize_callback' => 'rest_sanitize_boolean',
        'show_in_rest' => ['schema' => ['type' => 'boolean']],
    ]);
    register_post_meta('post', 'promogames_featured_order', $common + [
        'type' => 'integer',
        'default' => 0,
        'sanitize_callback' => 'absint',
        'show_in_rest' => ['schema' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 99]],
    ]);
}
add_action('init', 'promogames_core_register_meta');

function promogames_core_sanitize_editorial_type(mixed $value): string
{
    $value = sanitize_key((string) $value);
    return in_array($value, ['noticia', 'analise', 'guia', 'promocao'], true) ? $value : 'noticia';
}

/** @return array<int, string> */
function promogames_core_sanitize_platforms(mixed $value): array
{
    $allowed = ['playstation', 'xbox', 'nintendo', 'pc', 'mobile', 'vr'];
    $values = is_array($value) ? $value : explode(',', (string) $value);
    return array_values(array_intersect($allowed, array_unique(array_map('sanitize_key', $values))));
}

function promogames_core_sanitize_score(mixed $value): float
{
    return max(0, min(10, (float) $value));
}

function promogames_core_add_meta_box(): void
{
    add_meta_box('promogames-editorial', 'PromoGames — dados editoriais', 'promogames_core_render_meta_box', 'post', 'side', 'high');
}
add_action('add_meta_boxes', 'promogames_core_add_meta_box');

function promogames_core_render_meta_box(WP_Post $post): void
{
    wp_nonce_field('promogames_core_save_meta', 'promogames_core_nonce');
    $deck = (string) get_post_meta($post->ID, 'promogames_deck', true);
    $type = (string) get_post_meta($post->ID, 'promogames_editorial_type', true) ?: 'noticia';
    $platforms = (array) get_post_meta($post->ID, 'promogames_platforms', true);
    $score = get_post_meta($post->ID, 'promogames_review_score', true);
    $featured = (bool) get_post_meta($post->ID, 'promogames_featured', true);
    $order = (int) get_post_meta($post->ID, 'promogames_featured_order', true);
    ?>
    <p><label for="promogames_deck"><strong>Deck / linha fina</strong></label></p>
    <textarea class="widefat" rows="4" id="promogames_deck" name="promogames_deck"><?php echo esc_textarea($deck); ?></textarea>
    <p><label for="promogames_editorial_type"><strong>Tipo editorial</strong></label></p>
    <select class="widefat" id="promogames_editorial_type" name="promogames_editorial_type">
        <?php foreach (['noticia' => 'Notícia', 'analise' => 'Análise', 'guia' => 'Guia', 'promocao' => 'Promoção'] as $value => $label) : ?>
            <option value="<?php echo esc_attr($value); ?>" <?php selected($type, $value); ?>><?php echo esc_html($label); ?></option>
        <?php endforeach; ?>
    </select>
    <p><strong>Plataformas</strong></p>
    <?php foreach (['playstation' => 'PlayStation', 'xbox' => 'Xbox', 'nintendo' => 'Nintendo', 'pc' => 'PC', 'mobile' => 'Mobile', 'vr' => 'VR'] as $value => $label) : ?>
        <label style="display:block;margin:.35rem 0"><input type="checkbox" name="promogames_platforms[]" value="<?php echo esc_attr($value); ?>" <?php checked(in_array($value, $platforms, true)); ?>> <?php echo esc_html($label); ?></label>
    <?php endforeach; ?>
    <p><label for="promogames_review_score"><strong>Nota (0–10)</strong></label><input class="widefat" type="number" min="0" max="10" step="0.1" id="promogames_review_score" name="promogames_review_score" value="<?php echo esc_attr((string) $score); ?>"></p>
    <p><label><input type="checkbox" name="promogames_featured" value="1" <?php checked($featured); ?>> Destacar na home</label></p>
    <p><label for="promogames_featured_order"><strong>Ordem do destaque</strong></label><input class="small-text" type="number" min="0" max="99" id="promogames_featured_order" name="promogames_featured_order" value="<?php echo esc_attr((string) $order); ?>"></p>
    <?php
}

function promogames_core_save_meta(int $post_id): void
{
    if (!isset($_POST['promogames_core_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['promogames_core_nonce'])), 'promogames_core_save_meta')) {
        return;
    }
    if ((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || wp_is_post_revision($post_id) || !current_user_can('edit_post', $post_id)) {
        return;
    }

    $deck = isset($_POST['promogames_deck']) ? sanitize_textarea_field(wp_unslash($_POST['promogames_deck'])) : '';
    $type = promogames_core_sanitize_editorial_type(isset($_POST['promogames_editorial_type']) ? wp_unslash($_POST['promogames_editorial_type']) : 'noticia');
    $platforms = promogames_core_sanitize_platforms(isset($_POST['promogames_platforms']) ? (array) wp_unslash($_POST['promogames_platforms']) : []);
    $score = isset($_POST['promogames_review_score']) && $_POST['promogames_review_score'] !== '' ? promogames_core_sanitize_score(wp_unslash($_POST['promogames_review_score'])) : null;
    $featured = isset($_POST['promogames_featured']);
    $order = isset($_POST['promogames_featured_order']) ? min(99, absint($_POST['promogames_featured_order'])) : 0;

    $deck === '' ? delete_post_meta($post_id, 'promogames_deck') : update_post_meta($post_id, 'promogames_deck', $deck);
    update_post_meta($post_id, 'promogames_editorial_type', $type);
    update_post_meta($post_id, 'promogames_platforms', $platforms);
    $score === null ? delete_post_meta($post_id, 'promogames_review_score') : update_post_meta($post_id, 'promogames_review_score', $score);
    update_post_meta($post_id, 'promogames_featured', $featured);
    update_post_meta($post_id, 'promogames_featured_order', $order);
}
add_action('save_post_post', 'promogames_core_save_meta');

function promogames_core_register_rest_routes(): void
{
    register_rest_route('promogames/v1', '/home', [
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'args' => [
            'per_page' => ['default' => 4, 'sanitize_callback' => 'absint', 'validate_callback' => static fn ($value): bool => (int) $value >= 1 && (int) $value <= 12],
        ],
        'callback' => 'promogames_core_home_endpoint',
    ]);
}
add_action('rest_api_init', 'promogames_core_register_rest_routes');

function promogames_core_home_endpoint(WP_REST_Request $request): WP_REST_Response
{
    $query = new WP_Query([
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => (int) $request->get_param('per_page'),
        'meta_query' => [['key' => 'promogames_featured', 'value' => '1', 'compare' => '=']],
        'meta_key' => 'promogames_featured_order',
        'orderby' => ['meta_value_num' => 'ASC', 'date' => 'DESC'],
        'no_found_rows' => true,
    ]);

    $items = array_map(static function (WP_Post $post): array {
        $image = wp_get_attachment_image_src(get_post_thumbnail_id($post), 'large');
        return [
            'id' => $post->ID,
            'slug' => $post->post_name,
            'link' => get_permalink($post),
            'title' => ['rendered' => get_the_title($post)],
            'excerpt' => ['rendered' => apply_filters('the_excerpt', get_the_excerpt($post))],
            'date' => get_post_time('c', true, $post),
            'modified' => get_post_modified_time('c', true, $post),
            'author' => (int) $post->post_author,
            'featured_media' => (int) get_post_thumbnail_id($post),
            'image' => $image ? ['url' => $image[0], 'width' => $image[1], 'height' => $image[2]] : null,
            'categories' => wp_get_post_categories($post->ID),
            'meta' => [
                'promogames_deck' => (string) get_post_meta($post->ID, 'promogames_deck', true),
                'promogames_editorial_type' => (string) get_post_meta($post->ID, 'promogames_editorial_type', true),
                'promogames_platforms' => (array) get_post_meta($post->ID, 'promogames_platforms', true),
                'promogames_review_score' => get_post_meta($post->ID, 'promogames_review_score', true),
                'promogames_featured' => true,
                'promogames_featured_order' => (int) get_post_meta($post->ID, 'promogames_featured_order', true),
            ],
        ];
    }, $query->posts);

    return rest_ensure_response(['items' => $items, 'generated_at' => gmdate('c')]);
}

/** @return array{frontend:string,preview_secret:string,revalidate_url:string,revalidate_secret:string} */
function promogames_core_config(): array
{
    return [
        'frontend' => defined('PROMOGAMES_FRONTEND_URL') ? untrailingslashit(PROMOGAMES_FRONTEND_URL) : '',
        'preview_secret' => defined('PROMOGAMES_PREVIEW_SECRET') ? (string) PROMOGAMES_PREVIEW_SECRET : '',
        'revalidate_url' => defined('PROMOGAMES_REVALIDATE_URL') ? (string) PROMOGAMES_REVALIDATE_URL : '',
        'revalidate_secret' => defined('PROMOGAMES_REVALIDATE_SECRET') ? (string) PROMOGAMES_REVALIDATE_SECRET : '',
    ];
}

function promogames_core_preview_link(string $preview_link, WP_Post $post): string
{
    $config = promogames_core_config();
    if ($config['frontend'] === '' || $config['preview_secret'] === '') {
        return $preview_link;
    }
    return add_query_arg(['id' => $post->ID, 'secret' => $config['preview_secret']], $config['frontend'] . '/api/draft/');
}
add_filter('preview_post_link', 'promogames_core_preview_link', 10, 2);

function promogames_core_send_revalidation(int $post_id): void
{
    $post = get_post($post_id);
    if (!$post instanceof WP_Post || $post->post_type !== 'post' || wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }
    $config = promogames_core_config();
    if ($config['revalidate_url'] === '' || $config['revalidate_secret'] === '') {
        return;
    }

    $categories = get_the_category($post_id);
    $author = get_userdata((int) $post->post_author);
    $paths = array_map(static fn (WP_Term $term): string => '/categoria/' . $term->slug . '/', $categories);
    if ($author instanceof WP_User) {
        $paths[] = '/autor/' . $author->user_nicename . '/';
    }

    wp_remote_post($config['revalidate_url'], [
        'timeout' => 0.01,
        'blocking' => false,
        'headers' => ['Content-Type' => 'application/json', 'X-PromoGames-Secret' => $config['revalidate_secret']],
        'body' => wp_json_encode([
            'id' => $post_id,
            'slug' => $post->post_name,
            'status' => $post->post_status,
            'tags' => ['stories', 'story:' . $post->post_name],
            'paths' => array_values(array_unique($paths)),
        ]),
        'data_format' => 'body',
    ]);
}

function promogames_core_after_insert(int $post_id, WP_Post $post, bool $update, ?WP_Post $post_before): void
{
    unset($update, $post_before);
    if ($post->post_type === 'post') {
        promogames_core_send_revalidation($post_id);
    }
}
add_action('wp_after_insert_post', 'promogames_core_after_insert', 10, 4);
add_action('trashed_post', 'promogames_core_send_revalidation');
add_action('untrashed_post', 'promogames_core_send_revalidation');
add_action('before_delete_post', 'promogames_core_send_revalidation');

function promogames_core_admin_notice(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $config = promogames_core_config();
    if ($config['frontend'] && $config['preview_secret'] && $config['revalidate_url'] && $config['revalidate_secret']) {
        return;
    }
    echo '<div class="notice notice-warning"><p><strong>PromoGames Core:</strong> configure as constantes de integração no <code>wp-config.php</code> para habilitar preview e revalidação.</p></div>';
}
add_action('admin_notices', 'promogames_core_admin_notice');
