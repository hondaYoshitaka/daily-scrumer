;
(function ($) {

    $.fn.extend({
        findByAttr:function (key, val) {
            var condition = ['[', key, '="', val, '"]'].join('');
            return $(this).find(condition);
        },
        /* name属性で子要素を検索する。*/
        findByName:function (name) {
            return $(this).findByAttr('name', name);
        },

        /* data-role属性で小要素を検索する。 */
        findByRole:function (role) {
            return $(this).findByAttr('data-role', role);
        },
        /* form内の値をobject形式に変換する */
        serializeObj:function () {
            var result = {},
                array = $(this).serializeArray();
            for (var i = 0; i < array.length; i++) {
                var obj = array[i];
                var value = obj.value;
                if (value.match(/^[\d\.]*$/)) value = parseFloat(value);
                if (!value) value = undefined;
                var key = obj.name;
                var dst = (function () {
                    var dst = result;
                    while (key.match(/\./)) {
                        var prop = key.match(/([^\.]*)\./)[1];
                        if (!dst[prop]) dst[prop] = {};
                        dst = dst[prop];
                        key = key.replace(/[^\.]*\./, '');
                    }
                    return dst;
                })();
                dst[key] = value;
            }
            return result;
        },
        /* テキストの変化をリアルタイムで補足する */
        textchange:function (callback, interval) {
            return $(this).each(function () {
                var text = $(this),
                    val = text.val();
                var timer = setInterval(function () {
                    if (val != text.val()) {
                        val = text.val();
                        text.trigger('textchange');
                    }
                }, interval || 300);
                text
                    .data('textchange-timer', timer)
                    .on('textchange', function () {
                        callback.call(text, text.val());
                    })
                    .on('textchange-stop', function () {
                        clearInterval(text.data('textchange-timer'));
                    });
            });
        },
        /* エンターキーを補足する */
        pressEnter:function (callback) {
            return $(this).keypress(function (e) {
                switch (e.keyCode) {
                    case 13:
                        callback.apply(this, arguments);
                        break;
                }
            });
        },
        /* 指定されたパターンを排除するテキストボックス */
        exclusiveText:function (pattern, interval) {
            return $(this).textchange(function () {
                var text = $(this),
                    val = text.val();
                if (!(pattern instanceof RegExp)) {
                    pattern = new RegExp(pattern, 'g');
                }
                if (val.match(pattern)) {
                    val = val.replace(pattern, '');
                    text.val(val);
                }
            }, interval || 500);
        },
        /*
         * ローディングspinを表示。spin.jsを読み込む必要あり
         * 参考： http://fgnass.github.com/spin.js/
         */
        spin:function (opts) {
            return $(this).each(function () {
                var $this = $(this).addClass('spin'),
                    data = $this.data();
                if (data.spinner) {
                    data.spinner.stop();
                    delete data.spinner;
                }
                if (opts !== false) {
                    opts = $.extend({
                        color:$this.css('color'),
                        lines:11,
                        length:4,
                        width:2,
                        radius:4

                    }, opts);
                    data.spinner = new Spinner(opts)
                        .spin(this);
                }
            });
        },
        showSpin:function (size) {
            if (!size) size = 16;
            var elm = $(this),
                spin = $('.spin', elm);
            if (!spin.size()) {
                var spin = $('<div/>').css({
                    width:size,
                    height:size,
                    position:'absolute',
                    left:(elm.width() - size) / 2,
                    top:(elm.height() - size) / 2
                }).appendTo(elm).spin();
            }
            spin.show();
            return elm;
        },
        /* フォーム */
        form:function () {
            return $(this).each(function () {
                var form = $(this);
                form.findByRole('submit-btn').click(function () {
                    form.submit();
                });
            });
        },
        /* ajax検索フォーム */
        searchForm:function (callback) {
            return $(this).each(function () {
                var form = $(this).addClass('search-form'),
                    action = form.attr('action');
                form.submit(function (e) {
                    $.get(action, form.serializeObj(), callback);
                    e.preventDefault();
                });
            });
        },
        /* ajax投稿フォーム */
        ajaxForm:function (callback) {
            return $(this).each(function () {

                var form = $(this).addClass('post-form'),
                    action = form.attr('action'),
                    method = form.attr('method');

                form
                    .form()
                    .submit(function (e) {
                        form.showSpin();
                        $.ajax({
                            method:method,
                            url:action,
                            success:function (data) {
                                callback.call(form, data);
                            },
                            complete:function () {
                                $('.spin', form).hide();
                            }
                        });
                        e.preventDefault();
                    });
            });

        },
        /* データを動的に取り込むテーブル */
        loadableTable:function (data) {
            var table = $(this),
                thead = $('thead', table),
                tbody = $('tbody', table).empty();
            var keys = (function () {
                var keys = [];
                $('th', thead).each(function () {
                    var key = $(this).data('key');
                    keys.push(key);
                });
                return keys;
            })();
            data.forEach(function (data) {
                var tr = $('<tr/>').appendTo(tbody);
                keys.forEach(function (key) {
                    $('<td/>').text(data[key]).appendTo(tr);
                });
            });
            return table;
        },
        /* クラス名をつけたり外したり */
        flipClass:function (className, flg) {
            var elm = $(this);
            if (flg) {
                elm.addClass(className);
            } else {
                elm.removeClass(className);
            }
            return elm;
        },
        /* ダイアログ */
        dialog:function () {
            return $(this).each(function () {
                var dialog = $(this).hide().addClass('dialog'),
                    opener = $(dialog.data('opener')),
                    closer = dialog.findByRole('closer');
                opener.click(function () {
                    dialog.fadeIn();
                });
                closer.click(function () {
                    dialog.fadeOut();
                });
            });
        },
        header:function () {
            var header = $(this);

            var dialog = header.findByRole('dialog').dialog();

            $('#login-from', dialog).ajaxForm(function (data) {
                console.log('login done');
                dialog.findByRole('closer').trigger('click');
            });
            return header;
        }
    });
    $(function () {
        var body = $('body');

        $('header', body).header();
    });
})(jQuery);