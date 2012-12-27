var db = require('../db'),
    Sprint = db.models['Sprint'];


exports.index = function (req, res) {
    var team_name = res.locals.team && res.locals.team.name;
    Sprint.findByTeamName(team_name, function(sprints){
        res.render('setting/index.jade', {
            sprints:sprints
        });
    });
};
