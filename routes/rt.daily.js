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
    Sprint.findByTeamName(team.name, function (sprints) {
        var sprint = (function(){
            if(!sprints.length) return null;
            return sprints.sort(function(a, b){Number(a) - Number(b)})[0];
        })();
        if(!sprint){
            res.redirect(['/team', team.name, 'setting'].join('/'));
            return;
        }
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



