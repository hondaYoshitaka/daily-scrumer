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
        dataDisplay:function(data){
            var display = $(this);
            $('[data-key]', display).each(function () {
                var elm = $(this),
                    key = elm.data('key');
                elm.text(data[key]);
            });
            return display;
        },
        issueSection:function (project) {
            var section = $(this),
                doneRate = $('#issue-done-rate', section),
                progressBar = section.findByRole('progress-bar');

            project = true;//TODO remove
            if (project) {
                var data = {project_id:project};
                $.getJSON('/project/issue_count', data, function (data) {
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
        taskSection:function (project) {
            var section = $(this),
                doneRate = $('#task-done-rate', section),
                progressBar = section.findByRole('progress-bar');

            project = true; //TODO remove
            if (project) {
                var data = {project_id:project};
                $.getJSON('/project/task_time', data, function(data){
                    if(!data.success){
                        console.error('failed to get task time');
                        return;
                    }
                    section.dataDisplay(data);
                    var rate = (data.estimated - data.remain) / data.estimated;
                    progressBar.progressBar(rate);
                    doneRate.text((rate * 100).toFixed(1))
                });
            }
            return section;
        },
        keepInMindSection:function () {
            var section = $(this);
            $(':text', section)
                .editableText()
                .change(function () {

                });
            return section;
        },
        calendarSection:function () {
            var section = $(this);
            $('#calendar').datepicker({
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
            return section;
        },
        reportChart:function (data) {
            var chart = $(this),
                id = chart.attr('id');

            new Highcharts.Chart({
                title:{
                    text:'report'
                },
                chart:{
                    renderTo:id,
                    type:'line'
                },
                xAxis:{
                    type:'datetime'
                },
                yAxis:{
                    title:{
                        text:'y title'//TODO
                    }
                },
//                series:data.series
                series:[
                    {
                        name:'Tokyo',
                        data:[7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    },
                    {
                        name:'New York',
                        data:[-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                    },
                    {
                        name:'Berlin',
                        data:[-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                    },
                    {
                        name:'London',
                        data:[3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                    }
                ]
            });

            return chart;
        },
        reportChartSection:function () {
            var section = $(this).addClass('report-chart-section');
            var data = {
                series:[

                ]
            };
            $('#report-chart', section).reportChart(data);
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

            $.getJSON('/team/get', function (data) {
                $('.grouping-group', roulette).remove();
                var group = newGroup();
                data.members.forEach(function (data) {
                    if (isGroupFull(group)) {
                        group = newGroup();
                    }
                    $('<li/>').appendTo(group)
                        .groupingRouletteItem(data);
                });
                roulette.trigger('roulette-group.change')
            });

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
            roulette.on('roulette-group.change', function(){
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
        }
    });
    $(function () {
        var body = $('body');
        $('#head-nav', body).nav('daily');


        var issueSection = $('#issue-section', body).issueSection();
        var taskSection = $('#task-section', body).taskSection();
        $('#user-project-select', body).change(function () {
            var select = $(this),
                project = select.val();
            if (project) {
                issueSection.issueSection(project);
                taskSection.taskSection();
            }
        })
            .trigger('change') //TODO remove
        ;

        $('#keep-in-mind-section', body).keepInMindSection();

        $('#calendar-section', body).calendarSection();

        $('#report-chart-section', body).reportChartSection();

        $('#grouping-section', body).groupingSection();
    });
})(jQuery);