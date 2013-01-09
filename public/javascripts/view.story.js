(function ($) {
    $.fn.extend({

    });
    $(function () {

        var body = $(document.body);

        $('#head-nav', body).nav('story');

        var data = {
            sprint:CS.sprint,
            team_id:CS.team._id
        };
        $.get('/sprint/get_stories', data, function (data) {
            if (data.success) {
                console.log('sprint', data.stories);
                CS.stories = data.stories;
            } else {
                console.error('failed to load stories');
            }
        });

    });
})(jQuery);