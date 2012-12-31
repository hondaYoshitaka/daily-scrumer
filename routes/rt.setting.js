var db = require('../db'),
    Sprint = db.models['Sprint'],
    RedmineAgent = require('../agent')['Redmine'];


exports.index = function (req, res) {
    var team_name = res.locals.team && res.locals.team.name;
    Sprint.findByTeamName(team_name, function (sprints) {
        res.render('setting/index.jade', {
            sprints:sprints
        });
    });
};

exports.getRedmineProjects = function (req, res) {
    RedmineAgent.admin.getProjects(function (success, data) {
        res.json({
            success:success,
            projects:data
        });
    });
};

exports.getRedmineVersions = function (req, res) {
    var project = req.query.project;

    function fail() {
        res.json({
            success:false
        });
    }

    if (!project) {
        fail();
        return;
    }
    RedmineAgent.admin.getVersions(project, function (success, data) {
        if (!success) {
            fail();
            return;
        }
        res.json({
            success:success,
            versions:data
        });
    });

};

function failJson(res){
    res.json({
        success:false
    });
}

/* get issues statuses of redmine */
exports.getIssueStatuses = function (req, res) {
    RedmineAgent.admin.getIssueStatuses(function (success, data) {
        if (success) {
            res.json({
                success:true,
                issue_statuses:data
            });
        } else {
            failJson(res);
        }
    });
};

/* get redmine trackers */
exports.getTrackers = function(req, res){
    RedmineAgent.admin.getTrackers(function(success, data){
        if (success) {
            res.json({
                success:true,
                trackers:data
            });
        } else {
            failJson(res);
        }
    });
};