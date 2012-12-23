/*
 * チーム情報
 */

var db = require('../db'),
    Team = db.models['Team'];

/* /team下のrouteを全て受け取る */
exports.all = function(req, res, next){
    var team = req.session && req.session.team;
    var sameTeam = team && team.name == req.params.name;
    if(sameTeam){
        next();
    } else {
        Team.findByName(req.params.team.name, function(team){
            if(team){
                req.session.team = team;
                next();
            } else {
                res.redirect('/');
            }
        });
    }
};
