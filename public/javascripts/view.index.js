;(function($){
    $.fn.extend({

        teamSelectSection:function(){
            var section = $(this);

            var list = $('#team-list');
            var newForm = $('#new-team-form', section).ajaxForm(function(data){
                if(!data.success){
                    console.error('failed to create team');
                    return;
                }
                var li = $('<li/>').appendTo(list);
                var name = data.team.name;
                $('<a/>')
                    .attr('href', '/team/' + name)
                    .text(name)
                    .appendTo(li);
                newForm.hide();
                newBtn.removeAttr('style');
            });
            $(':text', newForm).change(function(){
                newForm.submit();
            }).patternedText();
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