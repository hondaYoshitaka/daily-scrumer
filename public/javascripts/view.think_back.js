;(function($){
    $.extend({

    });
    $.fn.extend({
        sprintSelect:function(){

        },
        workHourSection:function(){
            var section = $(this);

            return section;
        }
    });
    $(function(){
        var body = $(document.body);
        $('#head-nav', body).nav('think_back');

        $('#work-hour-section', body).workHourSection();
    });
})(jQuery);