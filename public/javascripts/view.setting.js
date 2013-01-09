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
            return $(this).each(function () {
                var li = $(this),
                    form = $('form', li);
                form
                    .validationForm('new_member')
                    .submit(function (e) {
                        e.preventDefault();
                        var valid = form.data('form.valid');
                        if (valid) {
                            li.trigger('member-list-change');
                        }
                    });
                var inputField = form.findByRole('input-field').hide();
                $(':text', form)
                    .editableText()
                    .change(function () {
                        inputField.hide();
                        form.submit();
                    });
                $('.editable', form).click(function () {
                    inputField.show();
                });

                var masterCheck = form.findByName('master'),
                    human = $('.human', form);
                masterCheck.get(0).checked = !!masterCheck.data('value');


                human
                    .on('update-human', function () {
                        var checked = masterCheck.get(0).checked;
                        if (checked) {
                            human.addClass('icon-master');
                        } else {
                            human.removeClass('icon-master');
                        }
                    })
                    .trigger('update-human');
                masterCheck
                    .change(function () {
                        form.submit();
                        human.trigger('update-human');
                    });

                li.removableListItem(function () {
                    form.remove();
                    li.trigger('member-list-change');
                }, msg.sure);

            });
        },
        memberSection:function () {
            var section = $(this),
                memberList = $('#mebmer-list', section);

            var data = {
                team_id:CS.team._id
            };
            $.get('/setting/get_redmine_members', data, function (data) {
                if (data.success) {
                    console.log('redmine mmebers', data);
                } else {
                    console.error('failed to load redmine members');
                }
            });

            var tmpl = {
                li:Handlebars.templates['tmpl.member-list-item']
            };
            memberList.data('members').forEach(function (data) {
                $(tmpl.li(data)).appendTo(memberList)
                    .memberListItem();
            });

            $('#member-add-btn').click(function () {
                var btn = $(this);
                if (btn.data('busy')) return;
                btn.busy();
                $(tmpl.li({})).appendTo(memberList)
                    .memberListItem()
                    .openUp();
            });

            section.on('member-list-change', function () {
                var data = {};
                data.team_id = CS.team._id;
                data.members = [];
                memberList.find('form').each(function () {
                    var form = $(this);
                    data.members.push(form.serializeObj());
                });
                $.post('/update_team/members', data, function (data) {
                    if (data.success) {

                    } else {
                        console.error('failed to update members');
                    }
                });
            });
            return section;
        },
        sprintListItem:function () {
            return $(this).each(function () {
                var li = $(this);
                var form = $('form', li).ajaxForm(function () {

                });
                li.findByRole('editable-text')
                    .editableText()
                    .change(function () {
                        form.submit();
                    });
                li.findByRole('date-input')
                    .dateInput()
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
            dialog.draggableDialog();
            return dialog.popupDialog(function () {
                var dialog = $(this),
                    sprintSelect = $('#redmine-sprint-select', dialog);

                (function (today) {
                    var end = new Date(today);
                    end.setDate(end.getDate() + 14);
                    $('#sprint-begin-input', dialog).dateInputVal(today);
                    $('#sprint-end-input', dialog).dateInputVal(end);
                })(new Date());

                dialog.css({
                    left:dialog.parent().width() - dialog.width()
                });


                sprintSelect.empty();
                sprintSelect.parent('li').showSpin();
                CS.team.redmine_projects.forEach(function (project) {
                    $.get('/setting/get_redmine_versions', {
                        project:project
                    }, function (data) {
                        sprintSelect.siblings('.spin').remove();
                        data.versions.reverse().forEach(function (data) {
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
            sprintList.data('data')
                .sort(function (a, b) {
                    return b.number - a.number
                })
                .forEach(function (data) {
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
                data.projects && data.projects.forEach(function (data) {
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
        redmineBugStatusTableRow:function () {
            var tr = $(this);
            var form = $('form', tr).ajaxForm(function (data) {
                if (data.success) {
                    CS.team = data.team;
                } else {
                    console.error('failed to update issue status');
                }
            });
            $('select', form)
                .selectableLabel()
                .change(function () {
                    if (form.data('busy')) return;
                    form.busy(400);
                    form.submit();
                });
            return tr;
        },
        redmineBugStatusPane:function () {
            var pane = $(this),
                table = $('#bug-status-table', pane),
                tbody = $('tbody', table);

            var tmpl = Handlebars.templates['tmpl.redmine-bug-status-table-row'];
            var issue_statuses = tbody.data('issue_statuses');

            if (issue_statuses) {
                Object.keys(issue_statuses).forEach(function (id) {
                    var data = issue_statuses[id];
                    data.team = CS.team._id;
                    var tr = $(tmpl(data)).appendTo(tbody)
                        .redmineBugStatusTableRow();
                    tr.findByName('report_as')
                        .val(data.report_as)
                        .trigger('change');
                });
            }
            table.showSpin();
            $.get('/setting/get_issue_statuses', function (data) {
                table.removeSpin();
                if (!data.success) {
                    console.error('failed to get_issue_statuses');
                    return;
                }
                data.issue_statuses.forEach(function (data) {
                    var exists = !!tbody.find('tr[data-id=' + data.id + ']').size();
                    if (exists) return;
                    data.team = CS.team._id;
                    $(tmpl(data)).appendTo(tbody)
                        .redmineBugStatusTableRow()
                        .find('select').trigger('change');
                });
            });
            return pane;
        },
        redmineTrackersTableRow:function () {
            var tr = $(this);
            var form = $('form', tr).ajaxForm(function (data) {
                if (data.success) {
                    CS.team = data.team;
                } else {
                    console.error('failed to update tracker');
                }
            });
            $('select', form)
                .selectableLabel()
                .change(function () {
                    form.submit();
                });
            return tr;
        },
        redmineTrackersPane:function () {
            var pane = $(this),
                table = $('#trackers-table', pane),
                tbody = $('tbody', table);

            var tmpl = Handlebars.templates['tmpl.redmine-trackers-table-row'];
            var trackers = tbody.data('trackers');
            if (trackers) {
                Object.keys(trackers).forEach(function (id) {
                    var data = trackers[id];
                    data.team = CS.team._id;
                    var tr = $(tmpl(data)).appendTo(tbody)
                        .redmineTrackersTableRow();
                    tr.findByName('report_as')
                        .val(data.report_as)
                        .trigger('change');
                });
            }
            table.showSpin();
            $.get('/setting/get_trackers', function (data) {
                table.removeSpin();
                if (!data.success) {
                    console.error('failed to get_trackers');
                    return;
                }
                data.trackers.forEach(function (data) {
                    var exists = !!tbody.find('tr[data-id=' + data.id + ']').size();
                    if (exists) return;
                    data.team = CS.team._id;
                    $(tmpl(data))
                        .appendTo(tbody)
                        .redmineTrackersTableRow()
                        .find('form').trigger('submit');

                });
            });

            return pane;
        },
        routineInputDialog:function (create) {
            var dialog = $(this),
                form = $('#new-routine-form', dialog);

            var tmpl = {
                weekDaySelect:Handlebars.templates['tmpl.week-day-select']
            };

            (function (selector) {
                var wrapper = $(selector);
                var data = wrapper.data();
                wrapper.html(tmpl.weekDaySelect(data));
            })('#routine-day-select-wrapper');

            form
                .validationForm('new_routine')
                .ajaxForm(function (data) {
                    if (data.success) {
                        CS.team = data.team;
                        form.emptyForm();
                        $('#new-routine-cancel-btn').trigger('click');
                        create && create.call(dialog, data.routine);
                    } else {
                        console.error('failed to save new routine')
                    }
                });
            return dialog.popupDialog(function () {

            });
        },
        routineListItem:function () {
            var tmpl = {
                weekDaySelect:Handlebars.templates['tmpl.week-day-select']
            }
            return $(this).each(function () {
                var li = $(this),
                    form = $('form', li);

                form.findByRole('editable-text')
                    .editableText();

                var daySelectWrapper = form.findByRole('day-select-wrapper');
                var daySelect = $(tmpl.weekDaySelect({
                    name:daySelectWrapper.data('name')
                }));
                daySelectWrapper.append(daySelect);
                daySelect
                    .val(daySelectWrapper.data('value'))
                    .selectableLabel()
                    .change(function () {
                        form.submit();
                    });

                form.submit(function (e) {
                    e.preventDefault();
                    form.trigger('update-routine-list');
                });

                li.removableListItem(function () {
                    form.remove();
                    li.trigger('update-routine-list');
                });
            });
        },
        routineSection:function () {
            var section = $(this);

            var tmpl = {
                listItem:Handlebars.templates['tmpl.routine-list-item']
            }
            $('#new-routine-input-dialog').routineInputDialog(function (data) {
                $(tmpl.listItem(data))
                    .appendTo(routineList)
                    .routineListItem();
            });

            var routineList = $('#routine-list', section);
            routineList
                .data('routines').forEach(function (data) {
                    $(tmpl.listItem(data))
                        .appendTo(routineList)
                        .routineListItem();
                });
            routineList
                .on('update-routine-list', function () {
                    var data = {};
                    data.team_id = CS.team._id;
                    data.routines = [];
                    $('form', routineList).each(function () {
                        var form = $(this)
                        data.routines.push(form.serializeObj());
                    });
                    $.post('/update_team/routine', data, function (data) {
                        if (data.success) {
                            CS.team = data.team;
                        } else {
                            console.error('failed to update routine');
                        }
                    });
                });


            return section;
        },
        alertLineSection:function () {
            var section = $(this);

            var colorPercent = (function (data) {
                var map = {};
                data.forEach(function (data) {
                    map[data.color] = data.percent;
                })
                return map;
            })(CS.team.alert_lines);
            section.findByRole('alert-line-input-wrapper').each(function () {
                var wrapper = $(this)
                var tmpl = {
                    form:Handlebars.templates['tmpl.alert-line-input-form']
                };
                var data = (function (color) {
                    percent = colorPercent[color];
                    if (percent === undefined)percent = wrapper.data('percent-default');
                    return {
                        color:color,
                        percent:percent
                    }
                })(wrapper.data('color'));
                var form = $(tmpl.form(data)).appendTo(wrapper);
                form.findByRole('editable-text')
                    .editableText()
                    .change(function () {
                        form.submit();
                    });
                form.submit(function (e) {
                    form.trigger('alert-line-change');
                    e.preventDefault();
                });
            });
            section.on('alert-line-change', function () {
                var data = {};
                data.team_id = CS.team._id;
                data.aliert_lines = [];
                $('form', section).each(function () {
                    var form = $(this);
                    data.aliert_lines.push(form.serializeObj());
                });
                $.post('/update_team/alert_line', data, function (data) {
                    if (data.success) {
                        CS.team = data.team;
                    } else {
                        console.error('failed to update alert line');
                    }
                });
            });

            return section;
        }
    });
    $(function () {
        var body = $(document.body);

        $('#member-section', body).memberSection();

        $('#sprint-section', body).sprintSection();

        $('#head-nav', body).nav('setting');


        $('#redmine-project-list-pane', body).redmineProjectListPane();

        $('#redmine-bug-status-pane', body).redmineBugStatusPane();
        $('#redmine-trackers-pane', body).redmineTrackersPane();

        $('#routine-section', body).routineSection();

        $('#alert-line-section', body).alertLineSection();
    });
})(jQuery);