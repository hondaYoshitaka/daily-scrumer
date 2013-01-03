;
(function ($) {
    var msg = {
        err:{
            bugs:{
                no_tracker:'[err]please set bug trackers'
            },
            tasks:{
                no_tracker:'[err]please set task trackers'
            }
        }
    };

    Array.prototype.shuffle = function () {
        var s = this;
        return s.sort(function () {
            return Math.random() > 0.5;
        });
    };


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
        calendarSection:function () {
            var section = $(this);
            var calendar = $('#calendar', section).datepicker({
                beforeShowDay:function (date) {
                    switch (date.getDay()) {
                        case 0:
                            return [true, 'selectable-date sunday'];
                        case 6:
                            return [true, 'selectable-date saturday'];
                    }

                    return [true, 'selectable-date'];
                },
                onSelect:function (date) {
                    date = new Date(date);
                    console.log('day selected:', date); //TODO
                }
            });


            var dateDisplay = section.findByRole('date-display').oneDayCalendar(new Date());
            dateDisplay.click(function () {
                dateDisplay.fadeOut(300, function () {
                    calendar.fadeIn(300);
                });
            });

            return section;
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
        selectableDateDate:function(){
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

        $('.odc-board').trigger('click');//TODO remove
        $.contextMenu({
            selector:'.selectable-date',
            items:{
                mark_as_holiday:{
                    name:'mark as holiday'
                },
                new_event:{
                    name:'new event'
                }
            },
            events:{
                show:function () {
                    var date = $(this).selectableDateDate();
                    console.log('date', date);
                }
            }
        })
    });
})(jQuery);