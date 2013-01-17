(function ($) {
    $.fn.extend({
        styleUrlListItem:function () {
            return $(this).each(function () {
                var li = $(this),
                    form = $('form', li);
                form
                    .validationForm('style_urls')
                    .submit(function (e) {
                        var valid = form.data('form.valid');
                        if (valid) {
                            form.trigger('style-list-item-change');

                        }
                        e.preventDefault();
                    });
                form.findByRole('editable-text')
                    .editableText()
                    .change(function () {
                        form.submit();
                    });
                li.removableListItem(function () {
                    form.remove();
                    li.trigger('style-list-item-change');
                });
            });
        },
        styleSection:function () {
            var section = $(this);
            var list = $('#style-url-list');

            var tmpl = {
                li:Handlebars.templates['tmpl.style-url-list-item']
            }
            list.data('urls').forEach(function (data) {
                $(tmpl.li(data))
                    .appendTo(list)
                    .styleUrlListItem();
            });

            $('#style-url-add-btn', section).click(function () {
                $(tmpl.li(''))
                    .appendTo(list)
                    .styleUrlListItem()
                    .openUp();
            });
            list.on('style-list-item-change', function () {
                var data = {};
                data.team_name = CS.team.name;
                data._id = CS.rule._id;
                data.style_urls = [];
                $('form', list).each(function () {
                    var form = $(this);
                    data.style_urls.push(form.findByName('style_url').val());
                });
                $.post('/rule/update/style_urls', data, function (data) {
                    if (list.data('busy')) return;
                    list.busy(300);
                    if (data.success) {

                    } else {
                        console.error('failed to update style urls');
                    }
                });
            });

            $('#style-load-btn', section).click(function () {
                section.showSpin();
                var data = {
                    rule_id:CS.rule._id
                };
                $.post('/styledocco/load', data, function (data) {
                    section.removeSpin();
                    if (data.success) {

                    } else {
                        console.error('failed to load styles');
                    }
                });
            });
            return section;
        }
    });
    $(function () {
        $('#style-section').styleSection();
    });
})(jQuery);