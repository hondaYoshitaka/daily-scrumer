(function ($) {
    $.fn.extend({
        checkpointListItem:function () {
            return $(this).each(function () {
                var item = $(this),
                    form = $('form', item);
                item.removableListItem(function () {
                    form.remove();
                    item.trigger('story-checkpoints-changed');
                });
                form
                    .validationForm('update_story_checkpoints')
                    .submit(function (e) {
                        e.preventDefault();
                        var valid = form.data('form.valid');
                        if (valid) {
                            form.trigger('story-checkpoints-changed');
                        }
                        return false;
                    });
                $(':checkbox', form).each(function(){
                    var checkbox = $(this),
                        value = checkbox.data('value');
                    if(value == checkbox.val()){
                        checkbox.get(0).checked = true;
                    }
                }).change(function(){
                        form.submit();
                    });
                item.findByRole('editable-text')
                    .editableText();
            });
        },
        checkpointList:function (data) {
            var ul = $(this),
                addBtn = ul.findByRole('checkpoint-add-btn');
            var tmpl = {
                li:Handlebars.templates['tmpl.checkpoint-list-item']
            };
            data && data.forEach(function (data) {
                $(tmpl.li(data)).insertBefore(addBtn)
                    .checkpointListItem();
            });
            addBtn.click(function () {
                $(tmpl.li({})).insertBefore(addBtn)
                    .checkpointListItem();
            });


            return ul;
        },
        storyListItem:function (data) {
            return $(this).each(function () {
                var item = $(this);
                var checkpointList = item.findByRole('checkpoint-list')
                    .checkpointList(data.checkpoints);

                checkpointList.on('story-checkpoints-changed', function () {
                    var data = {};
                    data.checkpoints = [];
                    $('form', checkpointList).each(function () {
                        var form = $(this);
                        data.checkpoints.push(form.serializeObj());
                    });
                    data.redmine_id = item.data('id');
                    data.sprint_id = CS.sprint._id;
                    $.post('/story/update_checkpoints', data, function (data) {
                        if (data.success) {
                            item.data(data.story);
                        } else {
                            console.error('failed to update checkpoints');
                        }
                    });
                });
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