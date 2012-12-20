;(function($){
    $.extend({

    });
    $.fn.extend({

        issueSection:function(project){
            var section = $(this);

            if(project){
                var data = {project_id:project};
                $.getJSON('issue/count', data, function(data){
                    console.log('get issue counts');
                });

            }
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
        $('#user-project-select', body).change(function(){
            var select = $(this),
                project = select.val();
            if(project){
                issueSection.issueSection(project);
            }
        });

        $('#keep-in-mind-section', body).keepInMindSection();

        $('#calendar-section', body).calendarSection();
    });
})(jQuery);