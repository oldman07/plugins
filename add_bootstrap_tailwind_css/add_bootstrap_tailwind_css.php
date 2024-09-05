<?php
/*
Plugin Name: Add BootStrap Tailwind Css
Description: A simple plugin to add Bootstrap and Tailwind CSS to your WordPress site.
Version: 1.0
License: GPLv2 or later
Author: Habib Ali
*/

// Ensure direct access is not allowed
if (!defined('ABSPATH')) {
    die("You are not eligible to access the resources."); // Exit if accessed directly
}

// Enqueue Bootstrap and Tailwind CSS based on context
function add_bootstrap_and_tailwind() {
    // Enqueue styles for the admin side
    
        // Enqueue styles for the client side
        wp_enqueue_style('bootstrap-css', 'https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css', array(), '5.3.0');
        wp_enqueue_style('tailwind-css', 'https://cdn.jsdelivr.net/npm/tailwindcss@^2/dist/tailwind.min.css', array(), '2.0.0');
    
}

// Enqueue styles for both the admin and client sides
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
