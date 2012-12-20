;(function($){
    $.extend({

    });
    $.fn.extend({
        memberListItem:function(data){
            return $(this).each(function(){
                var li = $(this)
                    .addClass('positioned');
                $('<input/>')
                    .attr({
                        type:'text'
                    })
                    .appendTo(li)
                    .val(data.name || '')
                    .editableText();
                $('<a/>').addClass('list-remove-btn')
                    .text('×')
                    .appendTo(li)
            });
        },
        memberSection:function(){
            var section = $(this),
                memberList = $('#mebmer-list', section);
            var team_id = null; //TODO
            var li = '<li/>';
            $.get('/team/get', {_id:team_id}, function(data){
                data.members.forEach(function(data){
                    $(li).appendTo(memberList)
                        .memberListItem(data);
                });
            });
            $('#member-add-btn', section).click(function(){
                $(li).appendTo(memberList)
                    .memberListItem({});

            });
            return section;
        }
    });
    $(function(){
        $('#member-section').memberSection();
        $('#head-nav').nav('setting');

    });
})(jQuery);