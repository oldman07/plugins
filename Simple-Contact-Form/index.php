<?php
/*
Plugin Name: Simple Contact Form
Description: Allows users to easily add their social media links using a shortcode.
Version: 1.0
* License: GPLv2 or later
Author: Habib Ali
*/

//only allow to access properly from admin side to secure the data
if (!defined('ABSPATH')) {
    die("You are not eligible to access the resources."); // Exit if accessed directly
} else {
  


// Function to add the menu item
function custom_contact_form_add_menu_item() {
    add_menu_page(
        'Custom Contact Form', // Page title
        'Custom Contact Forms', // Menu title
        'manage_options', // Capability required to access the page
        'custom-contact-form-settings', // Menu slug
        'custom_contact_form_sub_menu_page', // Function that renders the page
        'dashicons-database-export', // Icon URL
        6 // Position in the menu; lower numbers correspond with higher positions
    );
    add_submenu_page(
        'custom-contact-form-settings', // Parent slug
        'Custom Contact Form', // Page title
        'Custom Contact Forms', // Menu title
        'manage_options', // Capability required to access the page
        'custom-contact-form-settings', // Menu slug for this submenu
        'custom_contact_form_sub_menu_page' // Function that renders the submenu page
    );

    // Add second submenu
    add_submenu_page(
        'custom-contact-form-settings', // Parent slug
        'Second Submenu', // Page title
        'Second Submenu', // Menu title
        'manage_options', // Capability required to access the page
        'custom-contact-form-submenu2', // Menu slug for this submenu
        'second_submenu_function' // Function that renders the submenu page
    );
}
add_action('admin_menu', 'custom_contact_form_add_menu_item');

// Example functions for rendering submenu pages
function custom_contact_form_sub_menu_page() {
    echo "<div class='wrap'>";
    echo "<h1>Custom Contact Form - Submenu</h1>";
    echo "</div>";
}

function second_submenu_function() {
    echo "<div class='wrap'>";
    echo "<h1>Second Submenu</h1>";
    echo "</div>";
}




}