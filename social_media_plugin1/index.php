<?php
/*
Plugin Name: Social Media Links
Description: Allows users to easily add their social media links using a shortcode.
Version: 1.0
Author: Your Name
*/

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
            $html.= "<a href='{$link}' target='_blank'>{$platform}</a>";
        }
    }
    $html.= '</div>';

    return $html;
}
add_shortcode('social_media_links', 'social_media_links_shortcode');