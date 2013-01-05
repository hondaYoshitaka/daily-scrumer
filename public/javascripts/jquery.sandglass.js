;
(function ($) {
    var settings = {
        rate:0.5,
        tmpl:'' +
            '<div class="sg-bar-left"></div>' +
            '<div class="sg-bar-right"></div>' +
            '<div class="sg-board-up"></div>' +
            '<div class="sg-glass-up"></div>' +
            '<div class="sg-glass-down"></div>' +
            '<div class="sg-board-down"></div>'

    };

    var plugin = (function ($) {
        function applyTmpl(tmpl, data) {
            var str = tmpl;
            data && Object.keys(data).forEach(function (key) {
                str = str.replace(["{{", key, "}}"].join(''), data[key]);
            });
            return str;
        }


        return {
            sandglass:function (options) {
                $.extend(settings, options);
                return $(this).each(function () {
                    var root = $(this).addClass('sg-root');
                    root
                        .html(applyTmpl(settings.tmpl))
                        .css({
                        });
                });
            }
        }
    })($.sub());
    $.fn.extend(plugin);
})(jQuery);