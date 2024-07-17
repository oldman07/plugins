<?php
/*
Plugin Name: Social Media Links
Description: Allows users to easily add their social media links using a shortcode.
Version: 1.0
Author: Your Name
*/

// Include the settings page file
include_once(plugin_dir_path(__FILE__) . '/include/social-media-main.php');

// Enqueue the plugin's stylesheet
function social_media_links_enqueue_styles() {
    wp_enqueue_style('social-media-links-style', plugins_url('style.css', __FILE__));
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
            $html .= "<a href='{$link}' target='_blank'>{$platform}</a>";
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
}
add_action('admin_menu', 'social_media_links_add_menu_item');
