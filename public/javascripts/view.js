var requestAnimationFrame = (function () {
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var CS = {};
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
                if (dst[key]) {
                    var isArray = dst[key] instanceof Array;
                    if(!isArray){
                        dst[key] = [dst[key]];
                    }
                    dst[key].push(value);
                } else {
                    dst[key] = value;
                }
            }
            return result;
        },
        /* formのサブミット時にバリデーションを実行する
         * revalidator.schema.jsのキーを渡す。
         */
        validationForm:function (schemaKey) {
            var form = $(this).addClass('validation-form');
            if (!form.size()) return form;

            var schema = (function (schema) {
                var key = schemaKey;
                while (key.match(/\./)) {
                    schema = schema[key.match(/^[\.]*/)[0]];
                    key = key.replace(/^[\.]*\./, '');
                }
                return schema[key];
            })(window.json.validate.schema);
            form
                .on('form.validate', function () {
                    $('.err', form).removeClass('err');
                    var values = form.serializeObj();
                    var result = window.json.validate(values, {
                        properties:schema
                    });
                    var valid = result.valid;
                    form.data('form.valid', valid);
                    if (!valid) {
                        form.trigger('form.err', [result.errors]);
                    }
                })
                .on('form.err', function (e, err) {
                    var errDialog = $('.err-msg-dialog', form);
                    if (!errDialog.size()) {
                        errDialog = $('<div/>').appendTo(form);
                    }
                    var msg = [];
                    $.each(err, function (i, err) {
                        var name = err.property,
                            label = schema[name].label || 'label';
                        form.findByName(name).addClass('err');
                        msg.push(err.message.replace(/\{\{label\}\}/, label));
                    });
                    errDialog.errMsgDialog(msg);
                })
                .submit(function (e) {
                    form.trigger('form.validate');
                    var valid = form.data('form.valid');
                    if (!valid) {
                        e.preventDefault();
                    }
                });
            return form;
        },
        /* エラーメッセージ表示 */
        errMsgDialog:function (msg) {
            var dialog = $(this).addClass('err-msg-dialog').show(),
                ul = $('ul', dialog).empty();
            if (!ul.size()) {
                //一回目に表示した時
                ul = $('<ul/>').appendTo(dialog);
                dialog.click(function () {
                    dialog.fadeOut(200);
                });
                $('<a/>').addClass('close')
                    .text('[modify]')//TODO msg resource
                    .appendTo(dialog);
            }
            $.each(msg, function (i, msg) {
                $('<li/>').text(msg)
                    .appendTo(ul);
            });
            return dialog;
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
        /* パターン属性に合致しない中身を勝手に消す */
        patternedText:function (interval) {
            return $(this).each(function () {
                var text = $(this),
                    pattern = text.attr('pattern');
                if (!pattern) return;
                var regex = new RegExp('[^' + pattern + ']', 'g');
                text.textchange(function () {
                    var val = text.val();
                    text.val(val.replace(regex, ''));
                }, interval);
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
        /* フォームの中身を空にする */
        emptyForm:function () {
            return $(this).each(function () {
                var form = $(this);
                $('textarea', form).text('');
                $('input', form).each(function () {
                    var input = $(this),
                        type = input.attr('type');
                    switch (type) {
                        case 'checkbox':
                        case 'radio':
                            input.removeAttr('checked');
                            break;
                        case 'select':
                            $('option', input).removeAttr('selected');
                            break;
                        case 'submit':
                        case 'image':
                        case 'button':
                            break;
                        default:
                            input.val('');
                    }
                });
            })
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
        errForm:function () {
            var form = $(this).addClass('err');
            //TODO
            return form;
        },
        /* ajax投稿フォーム */
        ajaxForm:function (callback) {
            return $(this).each(function () {

                var form = $(this).addClass('post-form'),
                    action = form.attr('action'),
                    method = form.attr('method');

                form
                    .data('form.valid', true)
                    .form()
                    .submit(function (e) {
                        if (!form.data('form.valid'))return;
                        var data = form.serializeObj();
                        form.removeClass('err').showSpin();
                        form.addClass('loading');
                        $.ajax({
                            type:method,
                            url:action,
                            data:data,
                            success:function (data) {
                                callback.call(form, data);
                            },
                            complete:function () {
                                form.removeClass('loading');
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
        popupDialog:function (open, close) {
            return $(this).each(function () {
                var dialog = $(this).hide().addClass('dialog'),
                    opener = $(dialog.data('opener')),
                    closer = $(dialog.data('closer'));
                opener.click(function () {
                    opener.fadeOut();
                    dialog.fadeIn();
                    open && open.call(dialog);
                });
                closer.click(function () {
                    opener.fadeIn();
                    dialog.fadeOut();
                    close && close.call(dialog);
                });
            });
        },
        //編集可能ラベル
        //テキストボックスに対してこのプラグインを呼ぶといい感じになる。
        editableText:function () {
            return $(this).each(function () {
                var input = $(this).keydown(function (e) {
                    switch (e.keyCode) {
                        case 9:
                        case 13:
                            input.trigger('change');
                    }
                }).change(function () {
                        var val = input.val();
                        if (!val) return;
                        input.hide();
                        span.text(val).show();
                    });
                var span = $('<span/>').addClass('editable')
                    .insertAfter(input)
                    .click(function () {
                        input.show();
                        setTimeout(function () {
                            input.trigger('focus').select();
                        }, 20);
                        span.hide();
                    })
                    .css({
                        cursor:'pointer'
                    });
                var name = input.attr('name');
                if (name) span.attr('data-rs-name', name);
                if (input.attr('id'))span.attr('for', input.attr('id'));
                if (input.val()) input.trigger('change');
            });
        },
        nav:function (key) {
            var nav = $(this);
            var item = $('.nav-item', nav);
            var pressed = item
                .filter('[data-key=' + key + ']')
                .addClass('nav-item-pressed');
            item.not(pressed)
                .click(function () {
                    $(this).addClass('nav-item-pressed');
                });
            nav.findByRole('dropdown-menu').dropdownMenu();
        },
        removableListItem:function (remove, confirmMsg) {
            return $(this).each(function () {
                var li = $(this);
                if (li.is('.removable-list-item')) return;
                li.addClass('removable-list-item');
                $('<a/>').addClass('list-remove-btn')
                    .text('×')
                    .appendTo(li)
                    .click(function () {
                        if (confirmMsg) {
                            var cancel = !confirm(confirmMsg);
                            if (cancel) return;
                        }
                        remove.call(li);
                        li.animate({
                            height:0,
                            paddingTop:0,
                            paddingBottom:0
                        }, function () {
                            li.hide();
                        });
                    });
            });
        },
        dropdownMenu:function () {
            var menu = $(this),
                btn = $(menu.data('btn'));
            btn
                .click(function () {
                    menu.toggleClass('hidden');
                });
        },
        labeledCheckbox:function (change) {
            return $(this).change(function () {
                var checkbox = $(this),
                    checked = checkbox.is(':checked'),
                    label = checkbox.parent('label');
                if (checked) {
                    label.addClass('active');
                } else {
                    label.removeClass('active');
                }
                change && change.call(checkbox);
            });
        },
        dateInput:function (datePickerOptions) {
            var option = $.extend({
                dateFormat:'yy/mm/dd'
            }, datePickerOptions);
            return $(this).datepicker(option);
        }
    });
    $(function () {
        var body = $(document.body);

        body.ajaxError(function (e, req, setting, err) {
            alert('something is wrong!');
            console.error('[ajax err]', req.statusCode, err);
        });
    });
})(jQuery);