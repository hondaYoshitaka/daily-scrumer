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
                    $('<li/>')
                        .text(member.name)
                        .appendTo(memberList);
                });
            });

            return section;
        }
    });
    $(function(){
        $('#member-section').memberSection();
    });
})(jQuery);