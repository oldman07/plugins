<?php
/**
 * Plugin Name: Custom Posts Widget
 * Description: Displays recent or popular posts in the sidebar.
 * Version: 1.0
 * Author: Your Name
 * Author URI: Your Website
 */


 class Custom_Posts_Widget extends WP_Widget {

    function __construct() {
        parent::__construct(
            'custom_posts_widget', // Base ID
            __('Custom Posts Widget', 'text_domain'), // Name
            array( 'description' => __( 'Displays recent or popular posts', 'text_domain' ), ) // Args
        );
    }

    public function form($instance) {
       //this function is use to display the form on admin side wdiget
        $title = !empty($instance['title']) ? $instance['title'] : __('New title', 'text_domain');
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:', 'text_domain'); ?></label>
            <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        <?php
    }

    public function update($newInstance, $oldInstance) {
        $instance = array();
        $instance['title'] = (!empty($newInstance['title'])) ? strip_tags($newInstance['title']) : '';
        return $instance;
    }

    public function widget($args, $instance) {
        echo $args['before_widget'];
        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']). $args['after_title'];
        }
        // Display posts
        $this->display_posts();
        echo $args['after_widget'];
    }

    private function display_posts() {
        // Example query for recent posts
        $query_args = array(
            'post_type' => 'post',
            'posts_per_page' => 5,
            'orderby' => 'date',
            'order' => 'DESC'
        );

        $recent_posts_query = new WP_Query($query_args);

        if ($recent_posts_query->have_posts()) :
            echo '<ul>';
            while ($recent_posts_query->have_posts()) : $recent_posts_query->the_post();
                echo '<li><a href="' . get_permalink() . '">' . get_the_title() . '</a></li>';
            endwhile;
            echo '</ul>';
        endif;

        wp_reset_postdata();
    }
}

function register_custom_posts_widget() {
    register_widget('Custom_Posts_Widget');
}
add_action('widgets_init', 'register_custom_posts_widget');
