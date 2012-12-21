;
(function ($) {
    $.extend({

    });
    $.fn.extend({
        progressBar:function () {
            var bar = $(this).empty().addClass('progress-bar'),
                rate = bar.data('rate'),
                width = bar.width(),
                div = '<div/>';
            $(div)
                .appendTo(bar)
                .addClass('progress-filled')
                .css({
                    width:width * rate
                });
            return bar;
        },
        issueSection:function (project) {
            var section = $(this);
            project = true;//TODO remove
            if (project) {
                var data = {project_id:project};
                $.getJSON('project/issue_count', data, function (data) {
                    if (!data.success) {
                        console.error('failed to get issue_count');
                        return;
                    }
                    $('[data-key]', section).each(function () {
                        var elm = $(this),
                            key = elm.data('key');
                        elm.text(data[key]);
                    });
                    console.log('get issue counts');
                });
                section.findByRole('progress-bar').progressBar();
            }
            return section;
        },
        taskSection:function () {
            var section = $(this);

            section.findByRole('progress-bar').progressBar();
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
                onSelect:function(date){
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
        groupingRouletteItem:function(data){
            return $(this).each(function(){
                var item = $(this)
                    .addClass('grouping-roulette-item')
                    .text(data.name)
                    .draggable({
                        containment:'parent'
                    });
            });
        },
        groupingRoulette:function(){
            var roulette = $(this).addClass('grouping-roulette');
            $.getJSON('/team/get', function(data){
                data.members.forEach(function(data){
                    $('<div/>')
                        .appendTo(roulette)
                        .groupingRouletteItem(data);

                });
            });

            return roulette;
        },
        groupingSection:function(){
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