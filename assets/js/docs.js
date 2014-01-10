(function ($) {
    // Show grid examples in the lightbox to allow for resizing.
    // Bind to the show event.
    $(".demo-trigger").on("shown.r.lightbox", function (event) {
        $(".lightbox").addClass("container");
    });
    
    // Bind to the hidden event.
    $(".demo-trigger").on("hidden.r.lightbox", function (event) {
        var $this = $(this),
            $target = $($this.data("lightboxTarget"));
        $target.removeClass("hidden");
    });
}(jQuery));