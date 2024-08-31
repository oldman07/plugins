<?php
/*
Plugin Name: Social Media One Click
Description: Allows users to easily add their social media links using a shortcode.
Version: 1.02
* License: GPLv2 or later
Author: Habib Ali
*/

// Only allow access properly from admin side to secure the data
if (!defined('ABSPATH')) {
    die("You are not eligible to access the resources."); // Exit if accessed directly
} else {
    
    // Define the constant at the top of your main plugin file
    define('SOCIAL_MEDIA_MAIN_PATH', plugin_dir_path(__FILE__) . '/include/social-media-main.php');

    // Later in your code, when you need to include the file, use the constant
    include_once(SOCIAL_MEDIA_MAIN_PATH);

    // Enqueue the plugin's stylesheet
    function social_media_links_enqueue_styles() {
        global $post;

        // Check if we're inside the main loop in a post or page
        if (is_a($post, 'WP_Post') && stripos($post->post_content, '[social_media_links') !== false) {
            wp_enqueue_style(
                'social-media-links-style',
                plugins_url('style.css', __FILE__),
                array(),
                '1.0'
            );
        }
    }
    add_action('wp_enqueue_scripts', 'social_media_links_enqueue_styles');

    // Register the shortcode
    function social_media_links_shortcode($atts) {
        // Define default attributes
        $atts = shortcode_atts(array(
            'facebook' => '',
            'twitter' => '',
            'instagram' => '',
            // Add more social media platforms as needed
        ), $atts);

        // Generate the HTML for the social media links
        $html = '<div class="social-media-links">';
        foreach ($atts as $platform => $link) {
            if (!empty($link)) {
                $html .= '<a href="' . esc_url($link) . '" target="_blank">' . esc_html($platform) . '</a>';
            }
        }
        $html .= '</div>';

        return $html;
    }
    add_shortcode('social_media_links', 'social_media_links_shortcode');

    // Function to add the menu item
    function social_media_links_add_menu_item() {
        add_menu_page(
            'Social Media Links Settings', // Page title
            'Social Media Links', // Menu title
            'manage_options', // Capability required to access the page
            'social-media-links-settings', // Menu slug
            'social_media_links_settings_page', // Function that renders the page
            'dashicons-share-alt', // Icon URL
            6 // Position in the menu; lower numbers correspond with higher positions
        );
        add_submenu_page(
            'social-media-links-settings', // Parent slug
            'Custom Contact Form', // Page title
            'Custom Contact Forms', // Menu title
            'manage_options', // Capability required to access the page
            'social-media-links-settings', // Menu slug for this submenu
            'social_media_links_settings_page' // Function that renders the submenu page
        );

        // Add second submenu
        add_submenu_page(
            'social-media-links-settings', // Parent slug
            'Second Submenu', // Page title
            'Second Submenu', // Menu title
            'manage_options', // Capability required to access the page
            'custom-contact-form-submenu2', // Menu slug for this submenu
            'social_media_one_click_second_submenu_function' // Function that renders the submenu page
        );
    }
    add_action('admin_menu', 'social_media_links_add_menu_item');

    function social_media_one_click_second_submenu_function() {
        echo "<div class='wrap'>";
        echo "<h1>" . esc_html__('Second Submenu', 'social-media-one-click') . "</h1>";
        echo "</div>";
    }
}
?>
