<?php

// Function to add the menu item
function social_media_links_add_menu_item() {
    add_menu_page(
        'Image Gallery Settings', // Page title
        'Image Gallery', // Menu title
        'manage_options', // Capability required to access the page
        'Image-Gallery-settings', // Menu slug
        'Image_Gallery_settings_page', // Function that renders the page
        'dashicons-share-alt', // Icon URL
        7 // Position in the menu; lower numbers correspond with higher positions
    );
    add_submenu_page(
        'Image-Gallery-settings', // Parent slug
        'Custom Image Selection', // Page title
        'Custom Contact Forms', // Menu title
        'manage_options', // Capability required to access the page
        'Image-Gallery-settings', // Menu slug
        'Image_Gallery_settings_page', // Function that renders the page
    );

    // // Add second submenu
    // add_submenu_page(
    //     'social-media-links-settings', // Parent slug
    //     'Second Submenu', // Page title
    //     'Second Submenu', // Menu title
    //     'manage_options', // Capability required to access the page
    //     'custom-contact-form-submenu2', // Menu slug for this submenu
    //     'social_media_one_click_second_submenu_function' // Function that renders the submenu page
    // );
}
add_action('admin_menu', 'social_media_links_add_menu_item');


function Image_Gallery_settings_page(){
    echo "hil";
}