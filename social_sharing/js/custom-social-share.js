jQuery(document).ready(function($) {
    $('.entry-content').each(function() {
        var postType = $(this).closest('.post-type').data('type');
        if (postType === 'post') { // Check if it's a single post
            $(this).append('<div class="social-sharing"></div>');
            // Load social sharing buttons
            $.get('<?php echo plugins_url("custom-social-share.php", __FILE__);?>', function(data) {
                $('.social-sharing', this).html(data);
            });
        }
    });
});
