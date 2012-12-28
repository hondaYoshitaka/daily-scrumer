;
(function ($) {
    Array.prototype.shuffle = function () {
        var s = this;
        return s.sort(function () {
            return Math.random() > 0.5;
        });
    };
    $.extend({

    });

    var RateCircle = (function () {
        var Circle = function (radius, rate) {
            var s = this;
            s.radius = radius;
            s.rate = rate;
        };

        var Arc = function (color, radius, rate) {
            var s = this;
            s.color = color;
            s.radius = radius;
            s.rate = rate;
        };
        Arc.prototype.draw = function (ctx) {
            var s = this,
                PI = Math.PI;
            var lineW = 5;
            var r = s.radius;
            var x = r + lineW,
                y = r + lineW;
            ctx.strokeStyle = s.color;
            ctx.beginPath();
            ctx.lineWidth = lineW;
            ctx.moveTo(x, lineW * 5);
            var startAngle = PI * -0.5;
            var radius = r - lineW * 4;
            ctx.arc(x, y, radius,
                startAngle,
                startAngle + PI * 2 * s.rate,
                false);
            ctx.stroke();
        };

        Circle.prototype.draw = function (ctx) {
            var s = this;
            new Arc('#EEE', s.radius, 1).draw(ctx);
            new Arc('#33E', s.radius, s.rate).draw(ctx);
        };
        return Circle;
    })();
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
        progressBar:function (rate) {
            var bar = $(this).empty().addClass('progress-bar'),
                width = bar.width(),
                div = '<div/>';
            $(div)
                .appendTo(bar)
                .addClass('progress-filled')
                .animate({
                    width:width * rate
                });
            return bar;
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
        issueSection:function (sprint) {
            var section = $(this),
                doneRate = $('#issue-done-rate', section),
                progressBar = section.findByRole('progress-bar');

            sprint = true;//TODO remove
            if (sprint) {
                var data = {sprint_id:sprint};
                $.getJSON('/sprint/issue_count', data, function (data) {
                    if (!data.success) {
                        console.error('failed to get issue_count');
                        return;
                    }
                    section.dataDisplay(data);
                    var rate = data.done / data.total;
                    progressBar.progressBar(rate);
                    doneRate.text((rate * 100).toFixed(1))
                });
            }
            return section;
        },
        taskSection:function (sprint) {
            var section = $(this),
                doneRate = $('#task-done-rate', section),
                progressBar = section.findByRole('progress-bar');

            var rateCircle = $('#task-done-rate-circle');

            sprint = true; //TODO remove
            if (sprint) {
                var data = {sprint_id:sprint};
                $.getJSON('/sprint/task_time', data, function (data) {
                    if (!data.success) {
                        console.error('failed to get task time');
                        return;
                    }
                    section.dataDisplay(data);
                    var rate = (data.estimated - data.remain) / data.estimated;
                    progressBar.progressBar(rate);
                    rateCircle.rateCircle(rate);
                    doneRate.text((rate * 100).toFixed(1))

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
        dateDisplay:function (date) {
            var template = Handlebars.templates['tmpl.date-display'];

            var display = $(this);

            var html = template({
                month:date.getMonth() + 1,
                date:date.getDate()
            });

            display.html(html);


            return display;
        },
        calendarSection:function () {
            var section = $(this);
            var calendar = $('#calendar', section).datepicker({
                beforeShowDay:function (date) {
                    switch (date.getDay()) {
                        case 0:
                            return [true, 'sunday'];
                        case 6:
                            return [true, 'saturday'];
                    }

                    return [true, ''];
                },
                onSelect:function (date) {
                    date = new Date(date);
                    console.log('day selected:', date); //TODO
                }
            });


            var dateDisplay = section.findByRole('date-display').dateDisplay(new Date());
            dateDisplay.click(function () {
                dateDisplay.hide();
                calendar.show();
            });

            return section;
        },
        groupingRouletteItem:function (data) {
            return $(this).each(function () {
                var item = $(this)
                    .data('data', data)
                    .addClass('grouping-roulette-item')
                    .text(data.name)
                    .css({
                        left:0,
                        top:0
                    })
                    .draggable({
                        revert:true,
                        containment:'#grouping-section'
                    });
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
                $('.grouping-group', roulette).remove();
                var group = newGroup();
                if (members && members.length) {
                    members.forEach(function (data) {
                        if (isGroupFull(group)) {
                            group = newGroup();
                        }
                        $('<li/>').appendTo(group)
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
        rateCircle:function (rate) {
            var container = $(this).empty(),
                w = container.width(),
                h = container.height();
                ;
            var canvas = $('<canvas/>').appendTo(container),
                ctx = canvas.get(0).getContext('2d');

            var r = w / 2;
            var size = {
                width:r * 2,
                height:r * 2
            };

            canvas.attr(size).css(size);

            new RateCircle(r, rate).draw(ctx);


            return container;
        }
    });
    $(function () {
        var body = $('body');
        $('#head-nav', body).nav('daily');


        $('#issue-section', body).issueSection();
        $('#task-section', body).taskSection();


        $('#keep-in-mind-section', body).keepInMindSection();
        $('#calendar-section', body).calendarSection();
        $('#grouping-section', body).groupingSection();

        $('#traffic-light-section').trafficLightSection();
    });
})(jQuery);