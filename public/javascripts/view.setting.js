;(function ($) {
    var msg = {
        placeholder:{
            member_name:'member name'
        }
    };
    $.extend({

    });
    $.fn.extend({
        memberListItem:function (data) {
            return $(this).each(function () {
                var li = $(this)
                    .addClass('positioned');
                $('<input/>')
                    .attr({
                        type:'text',
                        placeholder:msg.placeholder.member_name
                    })
                    .appendTo(li)
                    .val(data.name || '')
                    .editableText()
                    .change(function () {

                    });
                $('<a/>').addClass('list-remove-btn')
                    .text('×')
                    .appendTo(li)
                    .click(function () {
                        var data = {};//TODO
                        $.post('/team/removeMember', data, function (data) {

                        });
                        li.animate({
                            height:0,
                            paddingTop:0,
                            paddingBottom:0
                        }, function () {
                            li.empty();
                        });
                    });
            });
        },
        memberSection:function () {
            var section = $(this),
                memberList = $('#mebmer-list', section);
            var team_id = null; //TODO
            var li = '<li/>';
            $.get('/team/get', {_id:team_id}, function (data) {
                data.members.forEach(function (data) {
                    $(li).appendTo(memberList)
                        .memberListItem(data);
                });
            });
            $('#member-add-btn', section).click(function () {
                $(li).appendTo(memberList)
                    .memberListItem({});

            });
            return section;
        }
    });
    $(function () {
        $('#member-section').memberSection();

        $('#head-nav').nav('setting');

        var teamSelect = $('#team-select').change(function(){

            var data = {_id:teamSelect.val()};
            $.post('/team/select', data, function(data){
                if(!data.success){
                    console.error('failed to select team.');
                    return;
                }
                var team = data.team;
                $('#selected-team').text(team.name);
            });
        });

    });
})(jQuery);