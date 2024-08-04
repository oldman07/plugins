<?php
/*
Plugin Name: Image Gallery Plugin
Description: A simple plugin to create and display image galleries.
Version: 1.0
Author: Your Name
*/

// Enqueue styles and scripts
function igp_enqueue_scripts() {
    wp_enqueue_style('igp-styles', plugins_url('/assets/css/styles.css', __FILE__));
    wp_enqueue_script('igp-scripts', plugins_url('/assets/js/scripts.js', __FILE__), array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'igp_enqueue_scripts');

function igp_enqueue_admin_scripts($hook) {
    if ($hook == 'post.php' || $hook == 'post-new.php') {
        wp_enqueue_media();
        wp_enqueue_script('igp-admin-scripts', plugins_url('/assets/js/admin-scripts.js', __FILE__), array('jquery'), null, true);
    }
}
add_action('admin_enqueue_scripts', 'igp_enqueue_admin_scripts');


// Register custom post type for galleries
function igp_register_gallery_cpt() {
    $labels = array(
        'name' => 'Galleries',
        'singular_name' => 'Gallery',
        'add_new' => 'Add New Gallery',
        'add_new_item' => 'Add New Gallery',
        'edit_item' => 'Edit Gallery',
        'new_item' => 'New Gallery',
        'view_item' => 'View Gallery',
        'search_items' => 'Search Galleries',
        'not_found' => 'No Galleries found',
        'not_found_in_trash' => 'No Galleries found in Trash',
        'parent_item_colon' => '',
        'menu_name' => 'Galleries'
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'show_ui' => true,
        'capability_type' => 'post',
        'hierarchical' => false,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_position' => 5,
        'exclude_from_search' => true,
    );

    register_post_type('igp_gallery', $args);
}
add_action('init', 'igp_register_gallery_cpt');

// Shortcode to display gallery
function igp_gallery_shortcode($atts) {
    $atts = shortcode_atts(array('id' => ''), $atts, 'igp_gallery');
    $gallery_id = $atts['id'];
    if (!$gallery_id) {
        return 'Gallery ID not specified.';
    }

    $gallery = get_post($gallery_id);
    if (!$gallery || $gallery->post_type !== 'igp_gallery') {
        return 'Invalid Gallery ID.';
    }

    $images = get_attached_media('image', $gallery_id);
    if (!$images) {
        return 'No images found in this gallery.';
    }

    $output = '<div class="igp-gallery">';
    foreach ($images as $image) {
        $img_url = wp_get_attachment_image_src($image->ID, 'large')[0];
        $output .= '<div class="igp-gallery-item"><img src="' . $img_url . '" alt=""></div>';
    }
    $output .= '</div>';

    return $output;
}
add_shortcode('igp_gallery', 'igp_gallery_shortcode');

// Register metabox for gallery images
function igp_add_gallery_metabox() {
    add_meta_box('igp_gallery_metabox', 'Gallery Images', 'igp_gallery_metabox_callback', 'igp_gallery', 'normal', 'high');
}
add_action('add_meta_boxes', 'igp_add_gallery_metabox');

function igp_gallery_metabox_callback($post) {
    wp_nonce_field('igp_save_gallery', 'igp_gallery_nonce');
    echo '<p>Select images for this gallery.</p>';
    echo '<input type="button" id="igp_upload_images_button" class="button" value="Select Images" />';
    echo '<input type="hidden" id="igp_gallery_image_ids" name="igp_gallery_images" value="" />';
    echo '<div id="igp_gallery_images">';
    $images = get_attached_media('image', $post->ID);
    foreach ($images as $image) {
        $img_url = wp_get_attachment_image_src($image->ID, 'thumbnail')[0];
        echo '<div class="igp-gallery-image" data-attachment_id="' . $image->ID . '"><img src="' . $img_url . '" alt=""><a href="#" class="igp-remove-image">&times;</a></div>';
    }
    echo '</div>';
}


function igp_save_gallery($post_id) {
    if (!isset($_POST['igp_gallery_nonce']) || !wp_verify_nonce($_POST['igp_gallery_nonce'], 'igp_save_gallery')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['igp_gallery_images'])) {
        $image_ids = array_map('intval', explode(',', $_POST['igp_gallery_images']));
        foreach ($image_ids as $image_id) {
            wp_update_post(array(
                'ID' => $image_id,
                'post_parent' => $post_id
            ));
        }
    }
}
add_action('save_post', 'igp_save_gallery');

register_activation_hook(__FILE__, 'igp_activate_plugin');
function igp_activate_plugin() {
    igp_register_gallery_cpt();
    flush_rewrite_rules();
}

register_deactivation_hook(__FILE__, 'igp_deactivate_plugin');
function igp_deactivate_plugin() {
    flush_rewrite_rules();
}
?>
