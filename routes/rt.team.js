/*
 * チーム情報
 */

var db = require('../db'),
    Team = db.models['Team'];

/* /team下のrouteを全て受け取る */
exports.all = function (req, res, next) {
    var team = req.session && req.session.team;
    var sameTeam = team && team.name == req.params.name;
    if (sameTeam) {
        next();
    } else {
        Team.findByName(req.params.name, function (team) {
            if (team) {
                req.session.team = team;
                next();
            } else {
                res.redirect('/');
            }
        });
    }
};


exports.new = function (req, res, next) {
    var data = req.body;
    var team = new Team({
        name:data.name
    });
    function fail(){
        res.json({
            success:false
        });
    }
    if (!team.isValid()) {
        fail();
        return;
    }
    Team.findByName(team.name, function(data){
        if(data){
            fail();
            return;
        }
        team.save(function(){
            res.json({
                success:true,
                team:team
            });
        });
    });
};