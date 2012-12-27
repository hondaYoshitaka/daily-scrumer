;
(function ($) {
    var msg = {
        placeholder:{
            member_name:'member name'
        }
    };
    $.extend({

    });
    $.fn.extend({
        openUp:function () {
            var elm = $(this),
                height = elm.height();
            elm.height(0)
                .animate({
                    height:height
                });
        },
        memberListItem:function () {
            var template = Handlebars.templates['tmpl.member-list-item'];
            return $(this).each(function () {
                var li = $(this)
                        .addClass('positioned'),
                    data = li.data('data');

                var html = template({
                    value:data && data.name,
                    placeholder:msg.placeholder.member_name
                });
                li.html(html);

                $(':text', li)
                    .editableText()
                    .change(function () {

                    });
                li.removableListItem(function () {
                    //TODO
                });
            });
        },
        memberSection:function () {
            var section = $(this),
                memberList = $('#mebmer-list', section);
            $('.member-list-item', memberList).memberListItem();

            $('#member-add-btn', section).click(function () {
                var btn = $(this);
                $('<li/>').insertBefore(btn)
                    .memberListItem()
                    .openUp();
            });
            return section;
        },
        sprintListItem:function () {
            var template = Handlebars.templates['tmpl.sprint-list-item'];
            return $(this).each(function () {
                var li = $(this),
                    data = li.data('data');
                li.addClass('paper inline float-left sprint-list-item');
                if(!data) return;
                var html = template({
                    member:data
                });
                li.html(html);

                var form = $('form').ajaxForm(function(){

                });
                li.findByName('number')
                    .editableText()
                    .change(function () {
                        form.submit();
                    });
                li.findByName('name')
                    .editableText()
                    .change(function () {
                        form.submit();
                    });
                li.removableListItem(function () {
                    //TODO
                });
            });
        },
        sprintList:function () {
            var ul = $(this);
            $('.sprint-list-item', ul).sprintListItem();
            return ul;
        },
        sprintSection:function () {
            var section = $(this);
            var form = $('#new-sprint-form', section)
                .validationForm('new_sprint')
                .ajaxForm(function (data) {
                    form.emptyForm();
                    $('<li/>').data('data', data.sprint)
                        .appendTo(sprintList)
                        .sprintListItem();
                });
            var sprintList = $('#sprint-list', section).sprintList();
            return section;
        }
    });
    $(function () {
        $('#member-section').memberSection();

        $('#sprint-section').sprintSection();

        $('#head-nav').nav('setting');

    });
})(jQuery);