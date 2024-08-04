jQuery(document).ready(function($) {
    var imageIdsInput = $('#igp_gallery_image_ids');
    var imagesContainer = $('#igp_gallery_images');
    var frame;

    $('#igp_upload_images_button').on('click', function(event) {
        event.preventDefault();

        // If the media frame already exists, reopen it.
        if (frame) {
            frame.open();
            return;
        }

        // Create the media frame.
        frame = wp.media({
            title: 'Select Images',
            button: {
                text: 'Add to gallery'
            },
            multiple: true // Set to true to allow multiple files to be selected
        });

        // When images are selected, run a callback.
        frame.on('select', function() {
            // Get the selected images.
            var attachments = frame.state().get('selection').toJSON();
            var ids = [];
            imagesContainer.empty();

            attachments.forEach(function(attachment) {
                ids.push(attachment.id);
                var img = '<div class="igp-gallery-image" data-attachment_id="' + attachment.id + '"><img src="' + attachment.sizes.thumbnail.url + '" alt=""><a href="#" class="igp-remove-image">&times;</a></div>';
                imagesContainer.append(img);
            });

            imageIdsInput.val(ids.join(','));
        });

        // Finally, open the modal on click.
        frame.open();
    });

    // Remove image from the gallery
    imagesContainer.on('click', '.igp-remove-image', function(event) {
        event.preventDefault();
        var imageDiv = $(this).closest('.igp-gallery-image');
        var attachmentId = imageDiv.data('attachment_id');
        var ids = imageIdsInput.val().split(',').filter(id => id != attachmentId.toString());

        imageDiv.remove();
        imageIdsInput.val(ids.join(','));
    });
});
