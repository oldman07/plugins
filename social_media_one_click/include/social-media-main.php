<?php
// social-media-main.php

function social_media_links_settings_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <p>This is the settings page for the Social Media Links plugin.
            To add social media just use the shortcode 
            [social_media_links facebook = "your-url" twitter = "your-twitter-url" instagram = "your-instagram-url"]
            make sure to replace your-twitter-url  etc with your orignal url 
        </p>

        <!-- You can add your settings form here -->
    </div>
    <?php
}
