(function ($) {
    $.fn.extend({
        checkpointListItem:function(){
            var item = $(this);

            return item;
        },
        checkpointList:function(data){
            var ul = $(this);

            return ul;
        },
        storyListItem:function () {
            return $(this).each(function () {

            });
        },
        storyList:function (data) {
            var ul = $(this);

            var tmpl = Handlebars.templates['tmpl.story-list-item'];
            data.forEach(function (data) {
                $(tmpl(data)).appendTo(ul)
                    .storyListItem();
            });
            return ul;
        },
        storyArticle:function () {
            var article = $(this);
            var storyList = $('#story-list', article);

            article.showSpin();
            var data = {
                sprint:CS.sprint,
                team_id:CS.team._id
            };
            $.get('/sprint/get_stories', data, function (data) {
                article.removeSpin();
                if (data.success) {
                    CS.stories = data.stories;
                    storyList.storyList(CS.stories);
                } else {
                    console.error('failed to load stories');
                }
            });
            return article;
        }


    });
    $(function () {

        var body = $(document.body);

        $('#head-nav', body).nav('story');


        $('#story-article', body).storyArticle();


    });
})(jQuery);