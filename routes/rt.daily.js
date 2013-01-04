/*
 * 日々見る画面
 */

var db = require('../db'),
    util = require('../util'),
    Sprint = db.models['Sprint'],
    Team = db.models['Team'];

exports.index = function (req, res) {
    if(!res.locals.team){
        res.redirect('/');
        return;
    }
    var team = new Team(res.locals.team);
    Sprint.findLatestByTeam(team.name, function (sprint) {
        res.render('daily/index.jade', {
            sprint:sprint,
            trackers:{
                task:team.getTaskTrackerIds(),
                bug:team.getBugTrackerIds()
            },
            today:util.date.truncateHours(util.date.getNow())
        });
    });
};



