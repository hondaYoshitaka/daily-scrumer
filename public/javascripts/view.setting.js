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
                li.addClass('inline float-left sprint-list-item');
                if (!data) return;
                var html = template({
                    member:data
                });
                li.html(html);

                var form = $('form', li).ajaxForm(function () {

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
                    var li = $('<li/>').data('data', data.sprint)
                        .prependTo(sprintList)
                        .sprintListItem();
                    var width = li.width();
                    li.css({
                        width:0
                    }).animate({
                            width:width
                        }, function () {
                            li.removeAttr('style');
                        });
                    $('#new-sprint-cancel-btn').trigger('click');
                });
            var sprintList = $('#sprint-list', section).sprintList();
            return section;
        },
        redmineProjectList:function (callback) {
            var ul = $(this);
            $.get('/setting/get_redmine_projects', function (data) {
                var tmpl = Handlebars.templates['tmpl.redmine-project-list-item'];
                data.projects.forEach(function (data) {
                    $(tmpl(data)).appendTo(ul);
                });
                callback.call(ul);
            });
            return ul;
        },
        redmineProjectListPane:function () {
            var pane = $(this);
            pane.showSpin();

            var form = $('#redmine-projects-form', pane).submit(function (e) {
                var action = form.attr('action');
                var data = {};
                data._id = form.findByName('_id').val();
                data.redmine_projects = [];
                form.findByName('project').filter(':checked').each(function () {
                    var project = $(this).val();
                    data.redmine_projects.push(project);
                });
                $.post(action, data, function () {

                });
                e.preventDefault();
            });
            var projectList = $('#redmine-project-list', pane).redmineProjectList(function () {
                $('.spinner', pane).remove();
                var checkbox = $(':checkbox', projectList).click(function () {
                    var checkbox = $(this),
                        checked = checkbox.is(':checked'),
                        label = checkbox.parent('label');
                    if (checked) {
                        label.addClass('active');
                    } else {
                        label.removeClass('active');
                    }
                    form.submit();
                });
                checkbox.each(function () {
                    var checkbox = $(this),
                        checked = form.data('projects').split(',');
                    checked.forEach(function (checked) {
                        if (checked === checkbox.val()) {
                            checkbox.get(0).checked = true;
                            checkbox.parent('label').addClass('active');
                        }
                    })
                });
            });

            return pane;
        }
    });
    $(function () {
        $('#member-section').memberSection();

        $('#sprint-section').sprintSection();

        $('#head-nav').nav('setting');

        $('#new-sprint-input-dialog').popupDialog();

        $('#redmine-project-list-pane').redmineProjectListPane();
    });
})(jQuery);