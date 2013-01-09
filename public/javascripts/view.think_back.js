;
(function ($) {

    CS.active_sprint = null;//選択中のスプリント

    $.extend({

    });
    $.fn.extend({
        sprintSelect:function (callback) {
            var select = $(this);
            select.change(function () {
                var sprint = $('option:selected', select).data('sprint');
                callback && callback.call(select, sprint);
            }).trigger('change');
            return select;
        },
        workHourChart:function (data) {
            var container = $(this),
                id = container.attr('id');
            new Highcharts.Chart({
                chart:{
                    renderTo:id,
                    type:'line',
                    marginRight:130,
                    marginBottom:25
                },
                title:{
                    text:'Work hours',
                    x:-20 //center
                },
                subtitle:{
                    text:'Sprint work hours',
                    x:-20
                },
                xAxis:{
                    type:'datetime',
                    maxZoom:14 * 24 * 3600000, // fourteen days
                    title:{
                        text:null
                    }
                },
                yAxis: {
                    title: {
                        text: 'hour'
                    },
                    showFirstLabel: false
                },
                tooltip:{
                    shared:true
                },
                legend:{
                    layout:'vertical',
                    align:'right',
                    verticalAlign:'top',
                    x:-10,
                    y:100,
                    borderWidth:0
                },
                series:[{
                    type: 'area',
                    name: 'work hours',
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: Date.UTC(2006, 0, 01),
                    data: data
                }]
            });

        },
        workHourSection:function (work_hours) {
            var section = $(this);

            var data = []
            work_hours && Object.keys(work_hours).forEach(function (key) {
                var utc = Number(key),
                    date = new Date(utc),
                    work_hour = work_hours[utc];
            });
            //TODO
            data = [
                0.8446, 0.8445, 0.8444, 0.8451,    0.8418, 0.8264,    0.8258, 0.8232,    0.8233, 0.8258,
                0.8283, 0.8278, 0.8256, 0.8292,    0.8239, 0.8239,    0.8245, 0.8265,    0.8261, 0.8269,
                0.8273, 0.8244, 0.8244, 0.8172,    0.8139, 0.8146,    0.8164, 0.82,    0.8269, 0.8269,
                0.8269, 0.8258, 0.8247, 0.8286,    0.8289, 0.8316,    0.832, 0.8333,    0.8352, 0.8357
            ];
            $('#work-hour-chart', section).workHourChart(data);
            return section;
        }
    });
    $(function () {
        var body = $(document.body);
        $('#head-nav', body).nav('think_back');
        $('#sprint-select', body).sprintSelect(function (sprint) {
            CS.active_sprint = sprint;
            $('#work-hour-section', body).workHourSection(sprint.work_hours);

        });
    });
})(jQuery);