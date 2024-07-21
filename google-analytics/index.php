<?php
/**
 * Plugin Name: Simple Google Analytics
 * Description: Easily add Google Analytics tracking code to your WordPress site.
 * Version: 1.0
 * Author: Your Name
 * Author URI: Your Website
 */


 function simple_google_analytics_menu() {
    add_options_page('Simple Google Analytics', 'Google Analytics', 'manage_options', 'simple-google-analytics', 'simple_google_analytics_settings_page');
}
add_action('admin_menu', 'simple_google_analytics_menu');

function simple_google_analytics_settings_page() {
?>
<div class="wrap">
    <h1>Simple Google Analytics Settings</h1>
    <form method="post" action="options.php">
        <?php settings_fields('simple_google_analytics_options'); ?>
        <?php do_settings_sections('simple_google_analytics_options'); ?>
        <table class="form-table">
            <tr valign="top">
                <th scope="row">Google Analytics Tracking ID</th>
                <td><input type="text" name="google_analytics_tracking_id" value="<?php echo esc_attr(get_option('google_analytics_tracking_id')); ?>" /></td>
            </tr>
        </table>
        <?php submit_button(); ?>
    </form>
</div>
<?php
}

function simple_google_analytics_register_settings() {
    register_setting('simple_google_analytics_options', 'google_analytics_tracking_id');
}
add_action('admin_init', 'simple_google_analytics_register_settings');


function simple_google_analytics_tracking_code() {
    $tracking_id = get_option('google_analytics_tracking_id');
    if (!empty($tracking_id)) {
?>
<script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo esc_js($tracking_id); ?>"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '<?php echo esc_js($tracking_id); ?>');
</script>
<?php
    }
}
add_action('wp_footer', 'simple_google_analytics_tracking_code');
