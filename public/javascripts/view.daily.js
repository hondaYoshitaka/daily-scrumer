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
        }
    });
    $(function(){
        $('#head-nav').nav('daily');



        var issueSection = $('#issue-section').issueSection();
        $('#user-project-select').change(function(){
            var select = $(this),
                project = select.val();
            if(project){
                issueSection.issueSection(project);
            }
        });

        $('#keep-in-mind-section').keepInMindSection();
    });
})(jQuery);