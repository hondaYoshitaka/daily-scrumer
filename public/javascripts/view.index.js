;(function($){
    $.fn.extend({
        teamSelectListItem:function(){
            return $(this).each(function(){
                var li = $(this).addClass('positioned');
                li.removableListItem(function(){
                    var data  = {name:li.data('name')}; //TODO
                    $.post('/remove_team', data, function(){

                    });
                }, "Are you sure?" /*TODO msg resource*/);
            })
        },
        teamSelectSection:function(){
            var section = $(this);
            var list = $('#team-list');
            $('li', list).teamSelectListItem();
            var newForm = $('#new-team-form', section).ajaxForm(function(data){
                if(!data.success){
                    console.error('failed to create team');
                    newForm.errForm();
                    return;
                }
                var li = $('<li/>').appendTo(list).teamSelectListItem();
                var name = data.team.name;
                li.data('name', name);
                $('<a/>')
                    .attr('href', '/team/' + name)
                    .text(name)
                    .appendTo(li);
                $(':text', newForm).val('');
                newForm.hide();
                newBtn.removeAttr('style');
            });
            $(':text', newForm).change(function(){
                newForm.submit();
            }).patternedText(500);
            var newBtn = $('#team-add-btn', section);
            newBtn.click(function(){
                var h = newForm.height();
                newForm.show().css({
                    height:0
                }).animate({
                        height:h
                    }, function(){
                        newBtn.hide();
                    });
            });
            return section;
        }
    });
    $(function(){
        $('#team-select-section').teamSelectSection();
    });
})(jQuery);