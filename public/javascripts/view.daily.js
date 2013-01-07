;
(function ($) {
    var msg = {
        err:{
            bugs:{
                no_tracker:'setting required.'
            },
            tasks:{
                no_tracker:'setting required.'
            }
        }
    };

    CS.eventTimeSelectTimes = (function (min, max) {
        var times = [];
        for (var i = min; i < max + 1; i++) {
            times.push({
                value:i,
                text:i
            });
        }
        return times;
    })(8, 20);

    CS.isSameDay = function (day1, day2) {
        return  day1.getYear() === day2.getYear()
            && day1.getMonth() === day2.getMonth()
            && day1.getDate() === day2.getDate();
    }

    Array.prototype.shuffle = function () {
        var s = this;
        return s.sort(function () {
            return Math.random() > 0.5;
        });
    };

    Number.prototype.toDigitString = function (digit) {
        var s = this,
            string = s.toString();
        while (string.length < digit) {
            string = "0" + string;
        }
        return string;
    }

    $.extend({
    });

    $.fn.extend({
        blink:function (duration, callback) {
            return $(this).each(function () {
                var elm = $(this);
                var timer = setInterval(function () {
                    elm.toggleClass('blink');
                }, 80);
                setTimeout(function () {
                    elm.removeClass('blink');
                    clearInterval(timer);
                    callback && callback(this);
                }, duration);
            });
        },
        randomEach:function (callback) {
            var elm = $(this),
                array = [];
            elm.each(function () {
                array.push(this);
            });
            array.shuffle().forEach(function (entry, i) {
                callback.call(entry, i, entry);
            });
            return elm;
        },
        /* dataの中身をdata-key属性を持った要素に突っ込む */
        dataDisplay:function (data) {
            var display = $(this);
            $('[data-key]', display).each(function () {
                var elm = $(this),
                    key = elm.data('key');
                elm.text(data[key]);
            });
            return display;
        },
        bugsSection:function (sprint) {
            var section = $(this),
                trackers = section.data('trackers');

            if (!trackers.length) {
                var tmpl = Handlebars.templates['tmpl.err_msg'],
                    err = msg.err.bugs.no_tracker;
                var title = $('.paper-title', section);
                title.siblings().remove();
                title.after(tmpl({msg:err}));
                return section;
            }


            var doneRate = $('#bug-done-rate', section),
                rateCircle = $('#bug-done-rate-circle', section);

            if (!sprint) return section;

            var data = {
                sprint:sprint,
                team_id:CS.team._id
            };

            section.showSpin();
            $.getJSON('/sprint/count_bugs', data, function (data) {
                section.removeSpin();
                if (!data.success) {
                    console.error('failed to get bug_count');
                    return;
                }
                section.dataDisplay(data);
                var rate = data.done / data.total;
                doneRate.text((rate * 100).toFixed(1));
                rateCircle.rateCircle(rate);
            });
            return section;
        },
        taskSection:function (sprint) {
            var section = $(this),
                trackers = section.data('trackers');

            if (!trackers.length) {
                var tmpl = Handlebars.templates['tmpl.err_msg'],
                    err = msg.err.tasks.no_tracker;
                var title = $('.paper-title', section);
                title.siblings().remove();
                title.after(tmpl({msg:err}));
                return section;
            }

            var
                doneRate = $('#task-done-rate', section),
                rateCircle = $('#task-done-rate-circle', section);

            if (sprint) {
                var data = {
                    sprint:sprint,
                    team_id:CS.team._id
                };
                section.showSpin();
                $.getJSON('/sprint/get_task_times', data, function (data) {
                    section.removeSpin();
                    if (!data.success) {
                        console.error('failed to get task time');
                        return;
                    }
                    section.dataDisplay(data);
                    var rate = (data.estimated - data.remain) / data.estimated;
                    doneRate.text((rate * 100).toFixed(1));

                    rateCircle.rateCircle(rate);
                });
            }
            return section;
        },
        keepInMindSection:function () {
            var section = $(this);

            var form = $('#keep-in-mind-form', section).ajaxForm(function () {

            });
            $(':text', section)
                .editableText()
                .change(function () {
                    form.submit();
                });
            var backContent = $('.photo-inner-frame-content-back', section);
            $('#keep-in-mind-name-plate', section)
                .mousedown(function () {
                    backContent
                        .show()
                        .stop()
                        .css({
                            top:backContent.parent().height()
                        })
                        .animate({top:0});
                })
                .mouseup(function () {
                    backContent
                        .stop()
                        .animate({
                            top:backContent.parent().height()
                        }, function(){
                            backContent.hide();
                        });
                });
            return section;
        },
        eventList:function (data) {
            var list = $(this).empty();
            var tmpl = {
                li:Handlebars.templates['tmpl.event_list_item'],
                timeSelect:Handlebars.templates['tmpl.event-time-select']
            }
            var timeSelect = tmpl.timeSelect({times:CS.eventTimeSelectTimes});

            var otherDayEvents = [];
            data && data.forEach(function (data) {
                var hit = (CS.today - new Date(data.date) == 0);
                if (!hit) {
                    otherDayEvents.push(data);
                    return;
                }
                var li = $(tmpl.li(data)).appendTo(list),
                    form = $('form', li);
                $(timeSelect)
                    .prependTo(form)
                    .val(data.time)
                    .selectableLabel()
                    .siblings('.selectable-label')
                    .removeClass('selectable-label')
                    .hide();

                li.findByRole('editable-text').editableText();
                li.findByRole('selectable-label').selectableLabel();
                li.removableListItem(function () {
                    form.remove();
                    list.trigger('refresh-calendar.events.list');
                });
                $(':text', form).change(function () {
                    form.submit();
                });
                form
                    .validationForm('update_event')
                    .submit(function (e) {
                        e.preventDefault();
                        if (form.data('busy')) return;
                        form.busy(500);
                        var valid = form.data('form.valid');
                        if (valid) {
                            list.trigger('refresh-calendar.events.list');
                        }
                    });
            });
            list.data('other-day-events', otherDayEvents);
            list.trigger('events-update');
            return list;
        },
        eventInputDialog:function () {
            var dialog = $(this),
                form = $('#new-event-form', dialog);
            form
                .validationForm('new_event')
                .ajaxForm(function (data) {
                    CS.events = data.calendar.events;
                    form.emptyForm();
                    dialog.trigger('refresh-calendar.events');
                    cancelBtn.trigger('click');
                });

            var tmpl = {
                timeSelect:Handlebars.templates['tmpl.event-time-select']
            }
            $('#new-event-time-select-wrapper')
                .empty()
                .append(tmpl.timeSelect({
                id:'#new-event-time-select',
                times:CS.eventTimeSelectTimes
            }));

            var cancelBtn = $('#new-event-cancel-btn', dialog).click(function () {
                form.emptyForm();
                dialog.trigger('refresh-calendar.events');
                dialog.fadeOut();
            });
            dialog.draggableDialog();
            return dialog.hide();
        },
        eventInputDialogPresent:function (date) {
            var dialog = $(this);
            date = new Date(date);
            dialog.findByName('date').val(date);
            var tmpl = {
                dateLabel:Handlebars.templates['tmpl.date-label']
            };
            var dateLabel = tmpl.dateLabel({
                year:date.getFullYear(),
                month:(date.getMonth() + 1).toDigitString(2),
                date:date.getDate().toDigitString(2)
            });
            $('#date-label-wrapper', dialog)
                .html(dateLabel);
            $('form')
            dialog.fadeIn();
        },
        calendar:function (onSelect) {
            var calendar = $(this).datepicker({
                beforeShowDay:function (date) {
                    switch (date.getDay()) {
                        case 0:
                            return [true, 'selectable-date sunday'];
                        case 6:
                            return [true, 'selectable-date saturday'];
                    }

                    return [true, 'selectable-date'];
                },
                onSelect:onSelect
            });
            var tmpl = {
                tooltip:Handlebars.templates['tmpl.calendar-tooltip'],
                eventItem:Handlebars.templates['tmpl.calendar-tooltip-event-item']
            };

            var tooltip = $(tmpl.tooltip()).appendTo(calendar),
                toolTipEventList = $('#calendar-tooltip-event-list', tooltip);
            $(document).on('mouseenter', '.selectable-date', function () {
                var hovered = $(this);
                if (hovered.data('busy'))return;
                hovered.busy(300);

                var tipped = tooltip.data('tipped') == this;
                if (tipped) return;
                tooltip.data('tipped', this);

                var position = hovered.position(),
                    events = hovered.data('events');

                if (events && events.length) {
                    var upper = position.top < (calendar.height() / 2);
                    tooltip
                        .hide()
                        .attr('data-dir', upper ? 'up' : 'down')
                        .fadeIn(200);
                    toolTipEventList.empty();
                    events.forEach(function (data) {
                        $(tmpl.eventItem(data))
                            .appendTo(toolTipEventList);
                    });

                    tooltip
                        .css({
                            top:position.top + (upper ? -(tooltip.outerHeight()) : 30),
                            left:position.left - 20
                        });
                }
            });
            calendar.mouseleave(function () {
                tooltip.fadeOut(200);
            });
            return calendar;
        },
        eventSection:function () {
            var section = $(this),
                fieldset = section.parent('fieldset'),
                routineList = $('#routine-list', section),
                eventList = $('#event-list', section);
            section.on('events-update', function () {
                var isEmpty = routineList.is(':empty') && eventList.is(':empty');
                if (isEmpty) {
                    fieldset.hide();
                } else {
                    fieldset.show();
                }
            });
            return section;
        },
        calendarSection:function () {
            var section = $(this),
                calendar = $('#calendar', section);

            calendar.calendar(function (date) {
                eventInputDialog.eventInputDialogPresent(date);
            });

            var eventInputDialog = $('#new-event-input-dialog', section).eventInputDialog();

            var dateDisplay = section.findByRole('date-display').oneDayCalendar(new Date());
            dateDisplay.click(function () {
                dateDisplay.fadeOut(300, function () {
                    calendar.fadeIn(300);
                });
            });

            $('#calnedar-close-btn', calendar).click(function () {
                calendar.fadeOut(300, function () {
                    dateDisplay.fadeIn(300);
                });
            });

            $.getJSON('/calendar', {team_name:CS.team.name}, function (data) {
                CS.holidays = data.holidays;
                CS.events = data.events;
                section
                    .trigger('refresh-calendar');
            });

            $('#calendar-context-menu', section)
                .calendarContextMenu('.selectable-date');


            var eventList = $('#event-list')
                .on('refresh-calendar.events.list', function (e) {
                    e.stopPropagation();
                    var data = {};
                    data.events = (function (form) {
                        var events = [];
                        form.each(function () {
                            events.push(form.serializeObj());
                        });
                        eventList.data('other-day-events').forEach(function (data) {
                            events.push(data);
                        });
                        return events;
                    })(eventList.find('form'));
                    data.team_name = CS.team.name;
                    $.post('/calendar/update_events', data, function (data) {
                        if (data.success) {
                            CS.events = data.calendar.events;
                            section.trigger('refresh-calendar.events');
                        } else {
                            console.error('failed to update  events');
                        }
                    });
                });

            section
                .on('refresh-calendar.events', function () {
                    eventList.eventList(CS.events);
                    $('.selectable-date', calendar).each(function () {
                        var elm = $(this),
                            date = elm.selectableDateDate();
                        elm.removeClass('has-event');
                        var events = [];
                        CS.events.forEach(function (event) {
                            var hit = (date - new Date(event.date) == 0);
                            if (hit) {
                                elm.addClass('has-event');
                                events.push(event);
                            }
                        });
                        elm.data('events', events);
                    });
                })
                .on('refresh-calendar.holiday', function () {
                    $('.holiday', section).removeClass('holiday');
                    Object.keys(CS.holidays).forEach(function (holiday) {
                        holiday = new Date(Number(holiday));
                        section.findByAttr({
                            'data-year':holiday.getFullYear(),
                            'data-month':holiday.getMonth()
                        }).each(function () {
                                var td = $(this);
                                var hit = Number(td.text()) == holiday.getDate();
                                if (hit) {
                                    td.addClass('holiday');
                                    return false;
                                }
                                return true;
                            });
                    });
                });

            return section;
        },
        calendarContextMenu:function (opener) {
            var menu = $(this);


            $('command', menu).click(function () {
                var command = $(this).data('command'),
                    date = menu.data('date');
                switch (command) {
                    case 'mark_as_holiday':
                        $.post('/calendar/add_holiday', {
                            date:date,
                            team_name:CS.team.name
                        }, function (data) {
                            if (data.success) {
                                CS.holidays = data.calendar.holidays;
                                menu.trigger('refresh-calendar.holiday');
                            } else {
                                console.error('failed to add holiday');
                            }
                        });
                        break;
                    case 'demark_as_holiday':
                        $.post('/calendar/remove_holiday', {
                            date:date,
                            team_name:CS.team.name
                        }, function (data) {
                            if (data.success) {
                                CS.holidays = data.calendar.holidays;
                                menu.trigger('refresh-calendar.holiday');
                            } else {
                                console.error('failed to remove holiday');
                            }
                        });
                        break;
                    case 'new_event':
                        $('#new-event-input-dialog').eventInputDialogPresent(date);
                        break;
                }
            });

            $.contextMenu({
                selector:opener,
                build:function ($trigger) {
                    var date = $trigger.selectableDateDate();
                    menu.data('date', date);
                    var items = $.contextMenu.fromMenu(menu);
                    Object.keys(items).forEach(function (key) {
                        var holiday = $trigger.hasClass('holiday'),
                            index = Number(key.replace('key', '')) - 1,
                            command = menu.children().eq(index).data('command');
                        switch (command) {
                            case 'mark_as_holiday':
                                if (holiday) delete items[key];
                                break;
                            case 'demark_as_holiday':
                                if (!holiday) delete items[key];
                                break;
                        }
                    });
                    return {
                        items:items
                    }
                }
            });
        },
        groupingRouletteItem:function (data) {
            return $(this)
                .data('data', data)
                .css({
                    left:0,
                    top:0
                })
                .draggable({
                    revert:true,
                    containment:'#grouping-section'
                });
        },
        groupingRouletteGroup:function () {
            return $(this).each(function () {
                var ul = $(this);
                var index = ul.siblings('.grouping-group').size() + 1;
                ul
                    .attr('data-index', index)
                    .droppable({
                        hoverClass:'grouping-group-active',
                        accept:'.grouping-roulette-item',
                        drop:function (e, ui) {
                            var item = $(ui.draggable.get(0));
                            var isSelf = item.parent().is(ul);
                            if (isSelf) return;
                            var data = item.data('data');
                            item = item
                                .remove()
                                .clone()
                                .appendTo(ul)
                                .groupingRouletteItem(data)
                                .removeClass('grouping-roulette-item-absent');
                            item.findByName('absent').val('false');
                            item.findByName('group').val(index);
                            ul.trigger('roulette-group.change');
                        }
                    });
                ul.trigger('roulette-group.change');
            }).addClass('grouping-group');
        },
        groupingAbsenteeArea:function () {
            var area = $(this);
            area.droppable({
                hoverClass:'absentee-area-active',
                accept:'.grouping-roulette-item',
                drop:function (e, ui) {
                    var item = $(ui.draggable.get(0)),
                        data = item.data('data');
                    item = item
                        .remove()
                        .clone()
                        .appendTo(area)
                        .groupingRouletteItem(data)
                        .addClass('grouping-roulette-item-absent');
                    item.findByName('absent').val('true');
                    item.findByName('group').val('');
                    area.trigger('roulette-group.change');
                }
            });
            return area;
        },
        groupingRoulette:function () {
            var roulette = $(this).addClass('grouping-roulette'),
                absenteeArea = $('#grouping-absentee-area', roulette);

            absenteeArea.groupingAbsenteeArea();

            (function (members) {
                var tmpl = Handlebars.templates['tmpl.grouping-roulette-item'];
                var groupArea = $('#grouping-group-area', roulette).empty();
                if (members && members.length) {
                    members.sort(function (a, b) {
                        return Number(a.group) - Number(b.group);
                    }).forEach(function (data) {
                            var group = $('.grouping-group:last', groupArea);
                            var acceptable = group.size() && group.children().size() < 2;
                            if (!acceptable) {
                                group = $('<ul/>').appendTo(groupArea)
                                    .groupingRouletteGroup();
                            }
                            var item = $(tmpl(data)).appendTo(group)
                                .groupingRouletteItem(data);

                            if (data.absent) {
                                item
                                    .addClass('grouping-roulette-item-absent')
                                    .appendTo(absenteeArea);
                            }
                        });
                    var group = $('.grouping-group', groupArea);
                    $('.grouping-roulette-item', groupArea).each(function () {
                        var item = $(this),
                            groupIndex = $('form', item).findByName('group').val();
                        if (groupIndex) {
                            group.eq(Number(groupIndex) - 1).append(item);
                        }
                    });
                    roulette.removeClass('no-member-roulette');
                } else {
                    roulette.addClass('no-member-roulette');
                }
                roulette.trigger('roulette-group.change');
                $('#grouping-group-add-btn', roulette).show().click(function () {
                    var btn = $(this).hide(),
                        group = $('<ul/>').appendTo(groupArea)
                            .groupingRouletteGroup();
                    var w = group.width();
                    group.css({
                        'min-width':'auto',
                        width:0
                    }).animate({
                            width:w
                        }, 300, function () {
                            group.removeAttr('style');
                            btn.show();
                        })

                });
            })(CS.team.members);

            var shuffle = function () {
                var group = $('.grouping-group', roulette),
                    item = $('.grouping-roulette-item', roulette).not('.grouping-roulette-item-absent');
                group.addClass('grouping-group-grouped');

                item.appendTo(roulette);
                var index = 0;
                item.randomEach(function (i, item) {
                    var isFull = group.eq(index).children().size() >= 2;
                    if (isFull) {
                        index++;
                    }
                    group.eq(index).append(item);
                });
                var hasHighlight = item.filter('.highlight').size() > 0;
                if (hasHighlight) {
                    item.toggleClass('highlight');
                } else {
                    item.filter(':even').addClass('highlight');
                    item.filter(':odd').removeClass('highlight');
                }
            };
            var startBtn = $('#grouping-shuffle-btn', roulette).click(function () {
                roulette.shuffleTimer = setInterval(shuffle, 140);
                startBtn.hide();
                stopBtn.fadeIn();
                $('.ui-draggable', roulette).draggable('disable');
            });
            var stopBtn = $('#grouping-stop-btn').click(function () {
                stopBtn.addClass('active');
                clearTimeout(roulette.shuffleTimer);
                var times = [200, 300, 400, 500, 800];

                function tick() {
                    shuffle();
                    var time = times.shift();
                    if (time) {
                        setTimeout(tick, time);
                    } else {
                        $('.grouping-roulette-item', roulette).removeClass('highlight');
                        $('.grouping-group', roulette).blink(800, function () {
                            stopBtn.hide()
                                .removeClass('active');
                            startBtn.show();
                            roulette.trigger('roulette-group.change')
                            $('.ui-draggable', roulette).draggable('enable');
                        });
                    }
                }

                tick();
            }).hide();


            return roulette;
        },
        groupingSection:function () {
            var section = $(this);

            var roulette = $('#grouping-roulette', section)
                .groupingRoulette();


            var availableCount = $('#availabel-group-count', workHourForm)
                .text($('.grouping-group', roulette).not(':empty').size());
            roulette
                .on('roulette-group.change', function () {
                    var group = $('.grouping-group', roulette).not(':empty'),
                        groupCount = group.size();
                    availableCount.text(groupCount);

                    var data = {};
                    data.team_id = CS.team._id;
                    data.members = [];
                    group.each(function () {
                        var group = $(this),
                            index = group.data('index');
                        $('form', group).findByName('group').val(index);
                    });
                    roulette.find('form').each(function () {
                        var form = $(this);
                        data.members.push(form.serializeObj());
                    });
                    $.post('/update_team/members', data, function (data) {
                        if (data.success) {
                            CS.team = data.team;
                        } else {
                            console.error('failed to update roulette-group');
                        }
                    });
                    workHourForm.submit();
                });
            var workHourForm = $('#work-hour-form', section).submit(function (e) {
                var form = $(this),
                    hour = form.findByName('hour').val(),
                    group = $('.grouping-group', roulette).not(':empty'),
                    groupCount = group.size();
                $.post('/sprint/update_work_hours', {
                    _id:CS.sprint._id,
                    day:CS.today,
                    work_hours:{
                        group:groupCount,
                        hour:Number(hour),
                        total:groupCount * Number(hour)
                    }
                }, function (data) {
                    if (data.success) {
                        CS.sprint = data.sprint;
                    } else {
                        console.error('failed to update work hours');
                    }
                });
                e.preventDefault();
            });
            workHourForm.find('input').change(function () {
                workHourForm && workHourForm.submit();
            });

            (function (work_hours) {
                if (!work_hours) return;
                Object.keys(work_hours).forEach(function (utc) {
                    var date = new Date(Number(utc));
                    var isSameDay = CS.isSameDay(CS.today, date);
                    if (isSameDay) {
                        var hour = work_hours[utc].hour;
                        workHourForm.findByName('hour').val(hour);
                    }
                });
            })(CS.sprint.work_hours)
            return section;
        },
        trafficLightSection:function () {
            var section = $(this);

            var light = section.findByRole('traffic-light');
            light.click(function () {
                $(this).addClass('on')
                    .siblings('.on')
                    .removeClass('on');
            });
            return section;
        },
        bugToHurrySection:function (sprint) {
            var section = $(this);
            if (sprint) {
                var data = {
                    sprint:sprint,
                    team_id:CS.team._id
                };
                section.showSpin();
                $.getJSON('/sprint/in_hurry_bugs', data, function (data) {
                    section.removeSpin();
                    var ul = $('#bug-to-hurry-list').empty();

                    var tmpl = {
                        li:Handlebars.templates['tmpl.bug_list_item']
                    };
                    if (!data.success) {
                        console.error('failed to get bugs to hurry');
                        return;
                    }
                    data.in_hurry_bugs.forEach(function (bug) {
                        $(tmpl.li(bug)).appendTo(ul);
                    });
                    $('#bug-to-hurry-see-more-btn', section)
                        .attr('href', data.urls && data.urls[0])
                });
            }

            return section;
        },
        selectableDateDate:function () {
            var elm = $(this),
                y = elm.data('year'),
                m = elm.data('month'),
                d = Number(elm.text());
            var date = new Date(0);
            date.setYear(y);
            date.setMonth(m);
            date.setDate(d);
            date.setHours(0);
            return date;
        },
        progressBar:function (rate) {
            var bar = $(this).addClass('progress-bar'),
                width = bar.width();
            bar.empty();
            $('<div/>')
                .addClass('progress-bar-filled')
                .appendTo(bar)
                .width(0)
                .animate({
                    width:width * rate
                });
            return bar;
        },
        daysSection:function () {
            var section = $(this);
            var rate = (function (sprint) {
                var begin = new Date(sprint.begin),
                    today = CS.today,
                    end = new Date(sprint.end);
                if ((end - begin) == 0) return 1;
                return (today - begin) / (end - begin);
            })(CS.sprint);
            var progressBar = $('#days-line', section).progressBar(rate);
            var form = $('form', section);
            form
                .findByRole('date-input')
                .dateInput()
                .editableText()
                .change(function () {
                    form.submit();
                });
            form
                .ajaxForm(function () {

                })
                .submit(function (e) {
                    e.preventDefault();
                });

            var tip = section.findByRole('progress-bar-tip');
            tip
                .css({
                    left:progressBar.width() * rate - (tip.width() / 2)
                })
            return section;
        }
    });
    $(function () {
        var body = $(document.body);

        $('#head-nav', body).nav('daily');

        setTimeout(function () {
            //初期表示を早めるために重い処理を後回しにしている。
            $('#bugs-section', body).bugsSection(CS.sprint);
            $('#task-section', body).taskSection(CS.sprint);
            $('#calendar-section', body).calendarSection();
            $('#bug-to-hurry-section', body).bugToHurrySection(CS.sprint);
        }, 100);


        $('#keep-in-mind-section', body).keepInMindSection();
        $('#grouping-section', body).groupingSection();
        $('#traffic-light-section', body).trafficLightSection();
        $('#days-section', body).daysSection();
        $('#events-section', body).eventSection();
    });
})(jQuery);