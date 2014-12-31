$(function($) {
    var History = window.History;
    var loading = false;
    var $ajaxContainer = $('#ajax-container');
    if (!History.enabled) {
        return false;
    }

    History.Adapter.bind(window, 'statechange', function() {
        var State = History.getState();
        // Get the requested url and replace the current content
        // with the loaded content
        $.get(State.url, function(result) {
            var $html = $(result);
            var $newContent = $('#ajax-container', $html).contents();

            // Set the title to the requested urls document title
            document.title = $html.filter('title').text();

            $('html, body').animate({
                'scrollTop': 0
            });

            $ajaxContainer.fadeOut(500, function() {

                $ajaxContainer.html($newContent);
                $ajaxContainer.fadeIn(500);

                NProgress.done();

                loading = false;
                showIndex = false;
            });
        });
    });

    $('body').on('click', '.js-ajax-link', function(e) {
        e.preventDefault();
        if (loading === false) {
            var currentState = History.getState();
            var url = $(this).attr('href');
            var title = $(this).attr('title') || null;
            // If the requested url is not the current states url push
            // the new state and make the ajax call.
            if (url !== currentState.url.replace(/\/$/, "")) {
                loading = true;

                NProgress.start();

                History.pushState({}, title, url);
            }
        }
    });
});
