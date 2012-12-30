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
                }, function () {
                    elm.removeAttr('style');
                });
        },
        open:function () {
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
        sprintInputDialog:function (create) {
            var tmpl = {
                option:Handlebars.templates['tmpl.redmine-sprint-select-option']
            };
            var dialog = $(this);
            var form = $('#new-sprint-form', dialog)
                .validationForm('new_sprint')
                .ajaxForm(function (data) {
                    form.emptyForm();
                    create.call(dialog, data);
                    $('#new-sprint-cancel-btn').trigger('click');
                });
            form.findByRole('date-input').dateInput({

            });
            return dialog.popupDialog(function () {
                var dialog = $(this),
                    sprintSelect = $('#redmine-sprint-select', dialog);

                (function(today){
                    var begin = today,
                        end = new Date(today);
                    end.setDate(end.getDate() + 14);
                    $('#sprint-begin-input', dialog).dateInputVal(begin);
                    $('#sprint-end-input', dialog).dateInputVal(end);
                })(new Date());


                sprintSelect.empty();
                sprintSelect.parent('li').showSpin();
                CS.team.redmine_projects.forEach(function(project){
                    $.get('/setting/get_redmine_versions', {
                        project:project
                    }, function(data){
                        sprintSelect.siblings('.spin').remove();
                        data.versions.reverse().forEach(function(data){
                            data.project = project;
                            sprintSelect.append(tmpl.option(data));
                        });
                    });
                });
            });
        },
        sprintSection:function () {
            var tmpl = Handlebars.templates['tmpl.sprint-list-item'];
            var section = $(this);

            var sprintList = $('#sprint-list', section);
            sprintList.data('data').forEach(function (data) {
                $(tmpl(data)).appendTo(sprintList)
                    .sprintListItem();
            });

            $('#new-sprint-input-dialog', section).sprintInputDialog(function (data) {
                $(tmpl(data.sprint))
                    .prependTo(sprintList)
                    .sprintListItem()
                    .open();
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
        },
        redmineBugStatusPane:function(){
            var pane = $(this);


            var table = $('#bug-status-table', pane),
                tbody = $('tbody', table);

            table.showSpin();
            $.get('/setting/get_issue_statuses', function(data){
                table.removeSpin();
                var tmpl = Handlebars.templates['tmpl.redmine-bug-status-table-row'];
                if(!data.success){
                    console.error('failed to get_issue_statuses');
                    return;
                }
                data.issue_statuses.forEach(function(data){
                    var tr = $(tmpl(data)).appendTo(tbody);
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


        $('#redmine-project-list-pane', body).redmineProjectListPane();

        $('#redmine-bug-status-pane', body).redmineBugStatusPane();
    });
})(jQuery);