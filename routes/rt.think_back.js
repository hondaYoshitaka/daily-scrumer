/*
 *  振り返りに関する画面
 */

var db = require('../db'),
    Sprint = db.models['Sprint'],
    util = require('../util'),
    Team = db.models['Team'];

exports.index = function (req, res) {
    var team_name = res.locals.team && res.locals.team.name;
    Sprint.findByTeamName(team_name, function (sprints) {
        res.render('think_back/index.jade', {
            sprints:sprints
        });
    }).sort({number:-1});
};