/*
 * チーム情報
 */

var db = require('../db'),
    Team = db.models['Team'];

/* /team以下全てを受け取る */
exports.all = function(req, res, next){
    var team = req.session.team;
    var sameTeam = team && team.name == req.params.name;
    if(sameTeam){
        next();
    } else {
        Team.findByName
        res.redirect('/');
    }
};
