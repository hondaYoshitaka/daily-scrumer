;
(function ($) {
    var settings = {
        dayLabel:[
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat'
        ],
        monthLabel:[
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        tmpl:'<div class="odc-board">' +
                '<div class="odc-hole"><div class="odc-hole-inner"></div></div>' +
                '<h3 class="odc-title">Today</h3>' +
                '<div class="odc-paper">' +
                    '<div class="odc-paper-content">' +
                        '<span class="odc-month">{{month}}</span>' +
                        '<div class="odc-date">{{date}}</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
    };

    var plugin = (function ($) {
        function applyTmpl(tmpl, data){
            var str = tmpl;
            Object.keys(data).forEach(function(key){
                str = str.replace(["{{", key, "}}"].join(''), data[key]);
            });
            return str;
        }
        $.fn.extend({

        });
        return {
            oneDayCalendar:function (date) {
                return $(this).each(function () {
                    var root = $(this).empty().addClass('odc-root');
                    date = new Date(date);
                    var html = applyTmpl(settings.tmpl, {
                        date:date.getDate(),
                        month:settings.monthLabel[date.getMonth()]
                    });
                    root.html(html);
                });
            }
        }
    })($.sub());
    $.fn.extend(plugin);
})(jQuery);