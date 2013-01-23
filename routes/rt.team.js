/*
 * チーム情報
 */

var db = require('../db'),
    util = require('../util'),
    Team = db.models['Team'],
    Member = Team.Member;

function fail(res) {
    res.json({
        success:false
    });
}

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
    if (!team.isValid()) {
        fail(res);
        return;
    }
    Team.findByName(team.name, function (data) {
        if (data) {
            fail(res);
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
    if (!name) {
        fail(res);
        return;
    }
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


exports.update = function (req, res) {
};

exports.update.redmine_projects = function (req, res) {
    var body = req.body;
    if (!body._id) {
        fail(res);
        return;
    }
    Team.findById(body._id, function (team) {
        if (!team) {
            fail(res);
            return;
        }
        team.redmine_projects = body.redmine_projects;
        team.update(function () {
            req.session.team = team;
            res.json({
                success:true,
                team:team
            });
        });
    });
};


exports.update.issue_statuses = function (req, res) {
    var body = req.body;
    if (!body.team_id) {
        fail(res);
        return;
    }
    Team.findById(body.team_id, function (team) {
        if (!team) {
            fail(res);
            return;
        }
        var status_id = body.issue_status_id;
        team.issue_statuses[status_id] = new Team.IssueStatus({
            id:status_id,
            name:body.name,
            report_as:body.report_as
        });
        team.update(function () {
            req.session.team = team;
            res.json({
                success:true,
                team:team
            });
        });
    });
};

exports.update.trackers = function (req, res) {
    var body = req.body;
    if (!body.team_id) {
        fail(res);
        return;
    }
    Team.findById(body.team_id, function (team) {
        if (!team) {
            fail(res);
            return;
        }
        var tracker_id = body.tracker_id;
        team.trackers[tracker_id] = new Team.Tracker({
            id:tracker_id,
            name:body.name,
            report_as:body.report_as
        });
        team.update(function () {
            req.session.team = team;
            res.json({
                success:true,
                team:team
            });
        });
    });
};

exports.update.members = function (req, res) {
    var body = req.body;
    var valid = body.team_id && body.members;
    if (!valid) {
        fail(res);
        return;
    }
    Team.findById(body.team_id, function (team) {
        if (!team) {
            fail(res);
            return;
        }
        team.members = [];
        body.members.forEach(function (data) {
            team.members.push(new Member(data));
        });
        team.update(function () {
            req.session.team = team;
            res.json({
                success:true,
                team:team
            });
        });
    });
};

exports.update.routine = function (req, res) {
    var body = req.body;
    var valid = body.team_id;
    if (!valid) {
        fail(res);
        return;
    }
    Team.findById(body.team_id, function (team) {
        if (!team) {
            fail(res);
            return;
        }
        team.routines = [];
        body.routines && body.routines.forEach(function (data) {
            team.routines.push(new Team.Routine(data));
        });
        team.update(function () {
            req.session.team = team;
            res.json({
                success:true,
                team:team
            });
        });
    });
};

exports.update.routine.add = function (req, res) {
    var body = req.body;
    var valid = body.team_id && body.title;
    if (!valid) {
        fail(res);
        return;
    }
    Team.findById(body.team_id, function (team) {
        if (!team) {
            fail(res);
            return;
        }
        var routine = new Team.Routine({
            title:body.title,
            detail:body.detail,
            day:body.day
        });
        team.routines.push(routine);
        team.update(function () {
            req.session.team = team;
            res.json({
                success:true,
                team:team,
                routine:routine
            });
        });
    });
};

exports.update.alert_line = function (req, res) {
    var body = req.body;
    var valid = body.team_id && body.aliert_lines;
    if (!valid) {
        fail(res);
        return;
    }
    Team.findById(body.team_id, function (team) {
        if (!team) {
            fail(res);
            return;
        }


        var alert_lines = [];
        body.aliert_lines.forEach(function (data) {
            alert_lines.push(new Team.AlertLine(data));
        });
        team.alert_lines = alert_lines;
        team.update(function () {
            req.session.team = team;
            res.json({
                success:true,
                team:team,
                alert_lines:alert_lines
            });
        });
    });
};
exports.update.jenkins_view = function(req, res){
    var body = req.body;
    var valid = !!body.team_id;
    if(!valid){
        fail(res);
        return;
    }
    Team.findById(body.team_id, function(team){
        if (!team) {
            fail(res);
            return;
        }
        var isArray = (body.jenkins_view instanceof Array);
        if(!isArray) {
            body.jenkins_view = [body.jenkins_view];
        }
        team.jenkins_view = body.jenkins_view;
        team.update(function () {
            req.session.team = team;
            res.json({
                success:true,
                team:team,
                jenkins_view:team.jenkins_view
            });
        });
    });
};