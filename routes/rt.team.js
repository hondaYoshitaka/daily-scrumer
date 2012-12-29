/*
 * チーム情報
 */

var db = require('../db'),
    Team = db.models['Team'];

/* /team下のrouteを全て受け取る */
exports.all = function (req, res, next) {
    var team = req.session && req.session.team;
    var sameTeam = team && team.name == req.params.name;
    req.params.team_name = req.params.name;
    if (sameTeam) {
        next();
    } else {
        Team.findByName(req.params.name, function (team) {
            if (team) {
                req.session.team = team;
                res.locals({team:team});
                next();
            } else {
                res.redirect('/');
            }
        });
    }
};


exports.new = function (req, res) {
    var data = req.body;
    var team = new Team({
        name:data.name
    });

    function fail() {
        res.json({
            success:false
        });
    }

    if (!team.isValid()) {
        fail();
        return;
    }
    Team.findByName(team.name, function (data) {
        if (data) {
            fail();
            return;
        }
        team.save(function () {
            res.json({
                success:true,
                team:team
            });
        });
    });
};

exports.remove = function (req, res) {
    var name = req.body.name;
    Team.findByName(name, function (team) {
        if (team) {
            team.remove(function () {
                res.json({
                    success:true,
                    team:team
                });
            });
        } else {
            res.json({
                success:false
            });
        }
    });
};


exports.update = {};

exports.update.redmine_projects = function (req, res) {
    var body = req.body;

    function fail() {
        res.json({
            success:false
        });
    }

    if (!body._id) {
        fail();
        return;
    }
    Team.findById(body._id, function (team) {
        if (!team) {
            fail();
            return;
        }
        team.redmine_projects = body.redmine_projects;
        team.update(function () {
            res.json({
                success:true,
                team:team
            });
        });
    });
};

