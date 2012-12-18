;(function($){
    $.extend({

    });
    $.fn.extend({
        memberSection:function(){
            var section = $(this),
                memberList = $('#mebmer-list', section);
            var team_id = null; //TODO
            $.get('/team/get', {_id:team_id}, function(data){
                data.members.forEach(function(member){
                    var li = $('<li/>').appendTo(memberList);
                    $('<input/>')
                        .attr({
                            type:'text'
                        })
                        .appendTo(li)
                        .val(member.name)
                        .editableText();
                });
            });

            return section;
        }
    });
    $(function(){
        $('#member-section').memberSection();
    });
})(jQuery);