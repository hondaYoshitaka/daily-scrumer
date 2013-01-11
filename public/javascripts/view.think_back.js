;(function ($) {

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
            return CS.chart.workHours(id, data);
        },
        workHourSection:function (begin, workHours) {
            var section = $(this);

            var data =(function(){
                var data = []
                if(!workHours) return data;
                var beginDate = new Date(begin).getDate();
                Object.keys(workHours).forEach(function (key) {
                    var utc = Number(key),
                        date = new Date(utc).getDate();
                    while(beginDate + data.length < date - 1){
                        data.push(0);
                    }
                    var work_hour = workHours[utc];
                    data.push(Number(work_hour.total));
                });
                return data;
            })();
            console.log('data', data);
            $('#work-hour-chart', section).workHourChart(data);
            return section;
        }
    });
    $(function () {
        var body = $(document.body);
        $('#head-nav', body).nav('think_back');
        $('#sprint-select', body).sprintSelect(function (sprint) {
            CS.active_sprint = sprint;
            $('#work-hour-section', body).workHourSection(sprint.begin, sprint.work_hours);

        });
    });
})(jQuery);