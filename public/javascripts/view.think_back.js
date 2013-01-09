;(function($){

    CS.active_sprint = null;//選択中のスプリント

    $.extend({

    });
    $.fn.extend({
        sprintSelect:function(){
            var select = $(this);
            select.change(function(){
                CS.active_sprint = $('option:selected', select).data('sprint');
                select.trigger('sprint-select-change', [CS.active_sprint]);
            }).trigger('change');
            return select;
        },
        workHourSection:function(){
            var section = $(this);

            return section;
        }
    });
    $(function(){
        var body = $(document.body);
        $('#head-nav', body).nav('think_back');

        $('#sprint-select', body).sprintSelect();
        $('#work-hour-section', body).workHourSection();
    });
})(jQuery);