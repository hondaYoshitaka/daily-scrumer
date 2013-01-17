;
(function ($) {

    CS.active_sprint = null;//選択中のスプリント
    Date.prototype.isSunday = function(){
        var s = this;
        return s.getDay() === 0;
    }
    Date.prototype.isSaturday = function(){
        var s = this;
        return s.getDay() === 6;
    }
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
        workHourTableForm:function (begin, end, work_hours) {
            var form = $(this);
            var days = (end - begin) / (24 * 60 * 60 * 1000);

            form.empty();

            var data = (function (date) {
                var data = {
                    labels:[],
                    groups:[],
                    hours:[]
                };
                for (var i = 0; i < days; i++) {
                    data.labels.push({
                        year:date.getFullYear(),
                        month:(date.getMonth() + 1),
                        date:date.getDate(),
                        class:(function(){
                            if(date.isSunday()){
                                return 'sunday';
                            }
                            if(date.isSaturday()){
                                return 'saturday';
                            }
                            return '';
                        })()
                    });

                    var utc = date.toUTC();
                    var work_hour = work_hours[utc];
                    data.groups.push(work_hour?work_hour.group:0);
                    data.hours.push(work_hour?work_hour.hour:0);
                    date.setDate(date.getDate() + 1);
                }
                return data;
            })(new Date(begin));
            var tmpl = {
                table:Handlebars.templates['tmpl.work-hours-table']
            }
            var table = $(tmpl.table(data)).appendTo(form);
            table.findByRole('editable-text').editableText().change(function(){

            });
            form.submit(function(e){
                var values = form.serializeObj();
                console.log('values');
                e.preventDefault();
            });


            return form;
        },
        workHourSection:function (sprint) {
            var section = $(this);
            var workHours = sprint.work_hours,
                begin = new Date(sprint.begin),
                end = new Date(sprint.end);
            var data = (function () {
                var data = []
                if (!workHours) return data;
                var beginDate = new Date(begin).getDate();
                Object.keys(workHours).forEach(function (key) {
                    var utc = Number(key),
                        date = new Date(utc).getDate();
                    while (beginDate + data.length < date - 1) {
                        data.push(0);
                    }
                    var work_hour = workHours[utc];
                    data.push(Number(work_hour.total));
                });
                return data;
            })();
            $('#work-hour-chart', section).workHourChart(data);
            $('#work-hour-table-form', section).workHourTableForm(begin, end, workHours);
            return section;
        }
    });
    $(function () {
        var body = $(document.body);
        $('#head-nav', body).nav('think_back');
        $('#sprint-select', body).sprintSelect(function (sprint) {
            CS.active_sprint = sprint;
            $('#work-hour-section', body).workHourSection(sprint);

        });
    });
})(jQuery);