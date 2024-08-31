<?php
/*
Plugin Name: Custom 404 Page
Description: Allows users to customize the appearance and content of the 404 error page.
Version: 1.0
Author: Your Name
*/

// Register the settings page
function custom_404_page_menu() {
    add_options_page(
        'Custom 404 Page',
        'Custom 404 Page',
        'manage_options',
        'custom-404-page',
        'custom_404_page_options_page'
    );
}
add_action('admin_menu', 'custom_404_page_menu');

// Render the settings page
function custom_404_page_options_page() {
    ?>
    <div class="wrap">
        <h1>Custom 404 Page</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('custom_404_page_options');
            do_settings_sections('custom-404-page');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Register settings, sections, and fields
function custom_404_page_settings_init() {
    register_setting('custom_404_page_options', 'custom_404_page_content');

    add_settings_section(
        'custom_404_page_section',
        '404 Page Settings',
        null,
        'custom-404-page'
    );

    add_settings_field(
        'custom_404_page_content',
        'Custom 404 Content',
        'custom_404_page_content_render',
        'custom-404-page',
        'custom_404_page_section'
    );
}
add_action('admin_init', 'custom_404_page_settings_init');

// Render the content field
function custom_404_page_content_render() {
    $content = get_option('custom_404_page_content');
    wp_editor($content, 'custom_404_page_content');
}

// Override the default 404 template
function custom_404_page_template($template) {
    if (is_404()) {
        $custom_content = get_option('custom_404_page_content');
        if (!empty($custom_content)) {
            echo apply_filters('the_content', $custom_content);
            exit;
        }
    }
    return $template;
}
add_filter('template_include', 'custom_404_page_template');
