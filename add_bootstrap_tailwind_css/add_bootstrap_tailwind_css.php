<?php
/*
Plugin Name: Add BootStrap Tailwind Css
Description: A simple plugin to add Bootstrap and Tailwind CSS to your WordPress site.
Version: 1.0
Author: Your Name
*/

// Ensure direct access is not allowed
if (!defined('ABSPATH')) {
    die("You are not eligible to access the resources."); // Exit if accessed directly
}

// Enqueue Bootstrap and Tailwind CSS when the plugin is activated
function add_bootstrap_and_tailwind() {
    // Enqueue Bootstrap CSS
    wp_enqueue_style('bootstrap-css', plugin_dir_url(__FILE__) . 'assets/css/bootstrap.css');

    // Enqueue Tailwind CSS from an external link
    wp_enqueue_style('tailwind-css', 'https://cdn.jsdelivr.net/npm/tailwindcss@^2/dist/tailwind.min.css');
}
add_action('wp_enqueue_scripts', 'add_bootstrap_and_tailwind');

// Handle plugin activation and deactivation
function my_plugin_activate() {
    // Activation logic here if needed
}
register_activation_hook(__FILE__, 'my_plugin_activate');

function my_plugin_deactivate() {
    // Deactivation logic here if needed
}
register_deactivation_hook(__FILE__, 'my_plugin_deactivate');
