;(function($){
    $.extend({

    });
    $.fn.extend({
        progressBar:function(){
            var bar = $(this).empty().addClass('progress-bar'),
                rate = bar.data('rate'),
                width = bar.width(),
                div = '<div/>';
            $(div)
                .appendTo(bar)
                .addClass('progress-filled')
                .css({
                    width:width * rate
                });
            return bar;
        },
        issueSection:function(project){
            var section = $(this);
            project = true;//TODO remove
            if(project){
                var data = {project_id:project};
                $.getJSON('project/issue_count', data, function(data){
                    if(!data.success){
                        console.error('failed to get issue_count');
                        return;
                    }
                    $('[data-key]', section).each(function(){
                        var elm = $(this),
                            key = elm.data('key');
                        elm.text(data[key]);
                    });
                    console.log('get issue counts');
                });
                section.findByRole('progress-bar').progressBar();
            }
            return section;
        },
        taskSection:function(){
            var section = $(this);

            section.findByRole('progress-bar').progressBar();
            return section;
        },
        keepInMindSection:function(){
            var section = $(this);
            $(':text', section)
                .editableText()
                .change(function(){

                });
            return section;
        },
        calendarSection:function(){
            var section = $(this);
            $('#calendar').datepicker({

            });
            return section;
        }
    });
    $(function(){
        var body = $('body');
        $('#head-nav', body).nav('daily');



        var issueSection = $('#issue-section', body).issueSection();
        var taskSection = $('#task-section', body).taskSection();
        $('#user-project-select', body).change(function(){
            var select = $(this),
                project = select.val();
            if(project){
                issueSection.issueSection(project);
                taskSection.taskSection();
            }
        })
            .trigger('change') //TODO remove
        ;

        $('#keep-in-mind-section', body).keepInMindSection();

        $('#calendar-section', body).calendarSection();
    });
})(jQuery);