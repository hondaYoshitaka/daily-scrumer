;
(function ($) {
    var msg = {
        placeholder:{
            member_name:'member name'
        },
        sure:'Are you sure?'
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
                },function(){
                    elm.removeAttr('style');
                });
        },
        open:function(){
            var elm = $(this);
            var w = elm.width(),
                h = elm.height();
            elm.css({
                width:0,
                height:h,
                overflow:'hidden'
            }).animate({
                    width:w
                }, function () {
                    elm.removeAttr('style');
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
            return $(this).each(function () {
                var li = $(this);
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
                    if (confirm(msg.sure)) {
                        $.post('/sprint/remove', {
                            _id:form.findByName('_id').val()
                        });
                    }
                });
            });
        },
        sprintSection:function () {
            var tmpl = Handlebars.templates['tmpl.sprint-list-item'];

            var section = $(this);
            var form = $('#new-sprint-form', section)
                .validationForm('new_sprint')
                .ajaxForm(function (data) {
                    form.emptyForm();
                    $(tmpl(data.sprint))
                        .prependTo(sprintList)
                        .sprintListItem()
                        .open();

                    $('#new-sprint-cancel-btn').trigger('click');
                });

            var sprintList = $('#sprint-list', section);
            sprintList.data('data').forEach(function(data){
                $(tmpl(data)).appendTo(sprintList)
                    .sprintListItem();
            });
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
                $.post(action, data, function (data) {
                    if (data.success) {
                        CS.team = data.team;
                    } else {
                        console.error('failed to update redmine_projects');
                    }
                });
                e.preventDefault();
            });
            var projectList = $('#redmine-project-list', pane).redmineProjectList(function () {
                $('.spinner', pane).remove();
                var checkbox = $(':checkbox', projectList).labeledCheckbox(function () {
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
        var body = $(document.body);

        $('#member-section', body).memberSection();

        $('#sprint-section', body).sprintSection();

        $('#head-nav', body).nav('setting');

        $('#new-sprint-input-dialog', body).popupDialog();

        $('#redmine-project-list-pane', body).redmineProjectListPane();
    });
})(jQuery);