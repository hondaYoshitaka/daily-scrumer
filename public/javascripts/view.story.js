(function ($) {
    $.fn.extend({
        checkpointListItem:function(){
            return $(this).each(function(){
                var item = $(this),
                    form = $('form', item);
                item.removableListItem(function(){
                    form.remove();
                });
                form
                    .validationForm('update_story_checkpoints')
                    .submit(function(e){
                        var valid = form.data('form.valid');
                        console.log('valid', valid);
                        if(valid){

                        }
                        e.preventDefault();
                    });
                item.findByRole('editable-text')
                    .editableText();
            });
        },
        checkpointList:function(data){
            var ul = $(this),
                addBtn = ul.findByRole('checkpoint-add-btn');
            var tmpl = {
                li:function(data){
                    data.index = $('li', ul).not(addBtn).size();
                    return Handlebars
                        .templates['tmpl.checkpoint-list-item']
                        (data);
                }
            };

            data && data.forEach(function(data){
                $(tmpl.li(data)).insertBefore(addBtn)
                    .checkpointListItem();
            });
            addBtn.click(function(){
                $(tmpl.li({})).insertBefore(addBtn)
                    .checkpointListItem();
            });
            return ul;
        },
        storyListItem:function (data) {
            return $(this).each(function () {
                var item = $(this).data(data);
                item.findByRole('checkpoint-list')
                    .checkpointList(data.checkpoints);
            });
        },
        storyList:function (data) {
            var ul = $(this);

            var tmpl = Handlebars.templates['tmpl.story-list-item'];
            data.forEach(function (data) {
                $(tmpl(data)).appendTo(ul)
                    .storyListItem(data);
            });
            return ul;
        },
        storyArticle:function () {
            var article = $(this);
            var storyList = $('#story-list', article);

            article.showSpin();
            var data = {
                sprint_number:CS.sprint.number,
                team_id:CS.team._id,
                team_name:CS.team.name
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