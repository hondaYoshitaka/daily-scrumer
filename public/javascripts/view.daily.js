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
            return section;
        },
        eventList:function (data) {
            var list = $(this).empty();
            var tmpl = {
                li:Handlebars.templates['tmpl.event_list_item'],
                timeSelect:Handlebars.templates['tmpl.event-time-select']
            }
            var timeSelect = tmpl.timeSelect({times:CS.eventTimeSelectTimes});
            data && data.forEach(function (data) {
                var hit = (CS.today - new Date(data.date) == 0);
                if (!hit) return;
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

            return dialog.hide();
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
            $('.selectable-date', calendar).mouseenter(function () {

                var tipped = tooltip.data('tipped') == this;
                if(tipped) return;
                tooltip.data('tipped', this);

                var hovered = $(this),
                    position = hovered.position(),
                    events = hovered.data('events');
                if(hovered.data('busy'))return;
                hovered.busy(300);

                if (events) {
                    var upper = position.top < (calendar.height() / 2);
                    tooltip.hide().fadeIn(200);

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
        calendarSection:function () {
            var section = $(this),
                calendar = $('#calendar', section);

            calendar.calendar(function (date) {
                date = new Date(date);
                eventInputDialog.findByName('date').val(date);
                var tmpl = {
                    dateLabel:Handlebars.templates['tmpl.date-label']
                };
                var dateLabel = tmpl.dateLabel({
                    year:date.getFullYear(),
                    month:(date.getMonth() + 1).toDigitString(2),
                    date:date.getDate().toDigitString(2)
                });
                $('#date-label-wrapper', eventInputDialog)
                    .html(dateLabel);

                eventInputDialog.fadeIn();
            });

            var eventInputDialog = $('#new-event-input-dialog', section).eventInputDialog();

            var dateDisplay = section.findByRole('date-display').oneDayCalendar(new Date());
            dateDisplay.click(function () {
                dateDisplay.fadeOut(300, function () {
                    calendar.fadeIn(300);
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
                        CS.events.forEach(function (event) {
                            var hit = (date - new Date(event.date) == 0);
                            if (hit) {
                                elm.addClass('has-event');
                                var events = elm.data('events');
                                if (!events) events = [];
                                events.push(event);
                                elm.data('events', events);
                            }
                        });
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
                ul.droppable({
                    hoverClass:'grouping-group-active',
                    accept:'.grouping-roulette-item',
                    drop:function (e, ui) {
                        var item = $(ui.draggable.get(0));
                        var isSelf = item.parent().is(ul);
                        if (isSelf) return;
                        var data = item.data('data');
                        item
                            .remove()
                            .clone()
                            .appendTo(ul)
                            .groupingRouletteItem(data)
                            .removeClass('grouping-roulette-item-absent');
                    }
                });
                ul.trigger('roulette-group.change');
            }).addClass('grouping-group');
        },
        groupingRoulette:function () {
            var roulette = $(this).addClass('grouping-roulette');

            function newGroup() {
                return $('<ul/>').prependTo(roulette)
                    .groupingRouletteGroup();
            }

            function isGroupFull(group) {
                return group.children().size() >= 2;
            }

            (function (members) {
                var tmpl = Handlebars.templates['tmpl.grouping-roulette-item'];
                $('.grouping-group', roulette).remove();
                var group = newGroup();
                if (members && members.length) {
                    members.forEach(function (data) {
                        if (isGroupFull(group)) {
                            group = newGroup();
                        }
                        $(tmpl(data)).appendTo(group)
                            .groupingRouletteItem(data);
                    });
                    roulette.removeClass('no-member-roulette');
                } else {
                    roulette.addClass('no-member-roulette');
                }
                roulette.trigger('roulette-group.change');
            })(CS.team.members);

            var shuffle = function () {
                var group = $('.grouping-group', roulette),
                    item = $('.grouping-roulette-item', roulette).not('.grouping-roulette-item-absent');
                group.addClass('grouping-group-grouped');

                item.appendTo(roulette);
                var index = 0;
                item.randomEach(function (i, item) {
                    var isFull = isGroupFull(group.eq(index));
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
                        $('.grouping-group').blink(800, function () {
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

            var absenteeArea = $('#grouping-absentee-area', roulette).droppable({
                hoverClass:'absentee-area-active',
                accept:'.grouping-roulette-item',
                drop:function (e, ui) {
                    var item = $(ui.draggable.get(0)),
                        data = item.data('data');
                    item
                        .remove()
                        .clone()
                        .appendTo(absenteeArea)
                        .groupingRouletteItem(data)
                        .addClass('grouping-roulette-item-absent');
                    absenteeArea.trigger('roulette-group.change');
                }
            });

            var availableCount = $('#availabel-group-count');
            roulette.on('roulette-group.change', function () {
                var count = $('.grouping-group').not(':empty').size();
                availableCount.text(count);
            });
            return roulette;
        },
        groupingSection:function () {
            var section = $(this);

            var roulette = $('#grouping-roulette', section)
                .groupingRoulette();
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
        }
    });
    $(function () {
        var body = $(document.body);

        $('#head-nav', body).nav('daily');


        $('#bugs-section', body).bugsSection(CS.sprint);
        $('#task-section', body).taskSection(CS.sprint);
        $('#bug-to-hurry-section', body).bugToHurrySection(CS.sprint);

        $('#keep-in-mind-section', body).keepInMindSection();
        $('#calendar-section', body).calendarSection();
        $('#grouping-section', body).groupingSection();

        $('#traffic-light-section', body).trafficLightSection();

        //$('.odc-board').trigger('click');//TODO remove


    });
})(jQuery);