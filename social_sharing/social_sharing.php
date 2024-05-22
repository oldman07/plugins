<?php
/**
 * Plugin Name: Custom Social Share
 * Description: Allows users to add custom social sharing buttons to posts and pages.
 * Version: 1.0
 * Author: Your Name
 */


 function custom_social_share_enqueue_styles() {
    $plugin_url = plugin_dir_url(__FILE__);
    wp_enqueue_style('custom-social-share-style', $plugin_url. '/css/custom-social-share.css');
}
add_action('wp_enqueue_scripts', 'custom_social_share_enqueue_styles');

 function custom_social_share_menu() {
    add_options_page(
        'Custom Social Share', // Page title
        'Custom Social Share', // Menu title
        'manage_options', // Capability
        'custom-social-share', // Menu slug
        'custom_social_share_settings' // Function to render the page
    );
}
add_action('admin_menu', 'custom_social_share_menu');

function custom_social_share_settings() {
    echo '<div class="wrap">';
    echo '<h2>Custom Social Share</h2>';
    // Add form fields here for managing social networks and other settings
    echo '</div>';
}

// Example function to display social sharing buttons
function display_social_sharing_buttons($post) {
    $url = esc_url(get_permalink($post->ID));
   ?>
    <div class="social-sharing">
        <!-- Example for Facebook -->
        <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo $url;?>" target="_blank">Facebook</a>
        <!-- Repeat for other social networks -->
    </div>
    <?php
}

// Call the function in single.php where you want the buttons to appear
display_social_sharing_buttons($post);
