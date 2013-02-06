;
(function ($) {

    CS.active_sprint = null;//選択中のスプリント
    Date.prototype.isSunday = function () {
        var s = this;
        return s.getDay() === 0;
    }
    Date.prototype.isSaturday = function () {
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

            $(document).on('update-sprint', function(e, sprint){
                var selected = $('option:selected', select);
                var hit = (selected.data('sprint')._id == sprint._id);
                if(hit){
                    selected.data('sprint', sprint);
                    selected.trigger('change');
                }
            });
            return select;
        },
        workHourChart:function (data, begin) {
            var container = $(this),
                id = container.attr('id');
            return CS.chart.workHours(id, data, begin);
        },
        workHourTableForm:function (begin, end, work_hours, sprint_id) {
            var form = $(this);
            var days = (end - begin) / (24 * 60 * 60 * 1000);

            form.empty();

            var data = (function (date) {
                var data = {
                    labels:[],
                    groups:[],
                    hours:[],
                    totals:[]
                };
                for (var i = 0; i < days; i++) {
                    var utc = date.toUTC();
                    data.labels.push({
                        year:date.getFullYear(),
                        month:(date.getMonth() + 1),
                        date:date.getDate(),
                        utc:utc,
                        class:(function () {
                            if (date.isSunday()) {
                                return 'sunday';
                            }
                            if (date.isSaturday()) {
                                return 'saturday';
                            }
                            return '';
                        })()
                    });

                    var work_hour = work_hours[utc];
                    data.groups.push(work_hour ? work_hour.group : 0);
                    data.hours.push(work_hour ? work_hour.hour : 0);
                    data.totals.push(work_hour ? work_hour.total : 0);
                    date.setDate(date.getDate() + 1);
                }
                return data;
            })(new Date(begin));
            var tmpl = {
                table:Handlebars.templates['tmpl.work-hours-table']
            }
            form.submit(function (e) {
                var data = {};
                data._id = sprint_id;
                data.work_hours = (function () {
                    var array = [];
                    $('thead', table).find('th').each(function (i) {
                        if (i == 0) return;
                        var obj = {};
                        var input = $('input', this);
                        obj[input.attr('name')] = parseInt(input.val(), 10);
                        array[i - 1] = obj;
                    });
                    $('tbody', table).find('tr').each(function () {
                        $('td', this).each(function (i) {
                            var input = $('input', this),
                                name = input.attr('name');
                            array[i][name] = input.val();
                        });
                    });
                    return array;
                })();
                $.post('/sprint/update_all_work_hours', data, function(data){
                    if(data.success){
//                        form.trigger('update-sprint', [data.sprint])
                    } else {
                        console.error('failed to update wrok hours');
                    }
                });
                e.preventDefault();
            });
            var table = $(tmpl.table(data)).appendTo(form);
            table.findByRole('editable-text').editableText().change(function () {
                if(table.data('busy')) return;
                table.busy(300);
                var groups = table.findByName('group'),
                    hours = table.findByName('hour'),
                    total = table.findByName('total'),
                    totalDisplay = table.findByRole('work-hour-total');
                for(var i=0; i<days;i++){
                    var val = Number(groups.eq(i).val()) * Number(hours.eq(i).val());
                    totalDisplay.eq(i).text(val);
                    total.eq(i).val(val);
                }
                form.submit();
            });


            return form;
        },
        workHourSection:function (sprint) {
            var section = $(this);
            var workHours = sprint.work_hours,
                begin = new Date(sprint.begin),
                end = new Date(sprint.end),
                id = sprint._id;
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
            $('#work-hour-chart', section).workHourChart(data, new Date(begin));
            $('#work-hour-table-form', section).workHourTableForm(begin, end, workHours, id);
            return section;
        }
    });
    $(function () {
        var body = $(document.body);
        $('#head-nav', body).nav('think_back');
        $('#sprint-select', body).sprintSelect(function (sprint) {
            CS.active_sprint = sprint
            $('#work-hour-section', body).workHourSection(sprint);

        });
    });
})(jQuery);