/*
 * 日々見る画面
 */

var db = require('../db'),
    Sprint = db.models['Sprint'];

exports.index = function (req, res) {
    var team_name = res.locals.team && res.locals.team.name;
    Sprint.findLatestByTeam(team_name, function (sprint) {
        console.log(sprint, team_name);
        res.render('daily.index.jade', {
            sprint:sprint
        });
    });
};

