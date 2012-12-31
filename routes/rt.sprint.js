/*
 * プロジェクト情報
 */

var RedmineAgent = require('../agent')['Redmine'],
    util = require('../util'),
    db = require('../db'),
    Team = db.models['Team'],
    Sprint = db.models['Sprint'];

/* get issues from redmine */
function getIssues(trackers, versions, callback) {
    var result = [];
    var agentReqCount = 0,
        abort = false;
    trackers.forEach(function (tracker_id) {
        versions.forEach(function (version) {
            agentReqCount++;
            RedmineAgent.admin.getIssue({
                project_id:version.project,
                fixed_version_id:version.id,
                status_id:'*',
                tracker_id:tracker_id
            }, function (sucess, issues) {
                if (abort) return;
                if (!sucess) {
                    abort = true;
                    callback(false);
                    return;
                }
                issues.forEach(function (bug) {
                    result.push(bug);
                });
                agentReqCount--;
                if (agentReqCount == 0) {
                    callback(true, result);
                }
            });
        });
    });
}

/* get bugs from redmine */
function getBugs(team_id, sprint, callback) {
    var versions = sprint.redmine_versions;
    if (!versions) {
        callback(false);
        return;
    }
    Team.findById(team_id, function (team) {
        var trackers = team.getBugTrackerIds();
        getIssues(trackers, versions, function (success, data) {
            callback(success, data, team);
        });
    });
}

/* get tasks from redmine */
function getTasks(team_id, sprint, callback) {
    var versions = sprint.redmine_versions;
    if (!versions) {
        callback(false);
        return;
    }
    Team.findById(team_id, function (team) {
        var trackers = team.getTaskTrackerIds();
        getIssues(trackers, versions, function (success, data) {
            callback(success, data, team);
        });
    });
}

function failJson(res) {
    res.json({
        success:false
    });
}

/* 不具合数を取得する */
exports.count_bugs = function (req, res) {
    var sprint = req.query.sprint,
        team_id = req.query.team_id;
    var data = {
        total:0,
        open:0,
        modified:0,
        done:0
    };
    getBugs(team_id, sprint, function (sucess, bugs, team) {
        if (!sucess) {
            failJson(res);
            return;
        }
        bugs.forEach(function (bug) {
            data.total++;
            var status = team.issue_statuses[String(bug.status_id)];
            switch (status.report_as) {
                case 'done':
                    data.done++;
                    break;
                case 'modified':
                    data.modified++;
                    break;
                default:
                    data.open++;
                    break;
            }
        });
        data.success = true;
        res.json(data);
    });
};

/* タスク時間の状況を取得する */
exports.task_time = function (req, res) {
    var sprint = req.query.sprint,
        team_id = req.query.team_id,
        versions = sprint.redmine_versions;

    function fail() {
        res.json({
            success:false
        });
    }

    if (!versions) {
        fail();
        return;
    }
    var data = {
        estimated:0,
        remain:0,
        consumed:0
    };
    getTasks(team_id, sprint, function (sucess, tasks, team) {
        if (!sucess) {
            failJson(res);
            return;
        }
        tasks.forEach(function (task) {
            data.estimated += (task.estimated_hours || 0);
        });
        res.json({
            success:true,
            estimated:130,
            remain:80,
            consumed:80
        });
    });
};

/* スプリントを新規作成する */
exports.new = function (req, res) {
    //TODO バリデーション
    var body = req.body;
    (function (versions) {
        var length = versions.length;
        for (var i = 0; i < length; i++) {
            console.log('versions[i]', versions[i]);
            versions[i] = JSON.parse(versions[i]);
        }
    })(body.redmine_versions);
    var sprint = new Sprint(body);
    sprint.save(function () {
        res.json({
            success:true,
            sprint:sprint
        });
    });
};

/* スプリントを更新する */
exports.update = function (req, res) {
    var body = req.body;
    Sprint.findById(body._id, function (sprint) {
        if (!sprint) {
            res.json({
                success:false
            });
            return;
        }
        util.obj.deepCopy(body, sprint);
        sprint.update(function () {
            res.json({
                success:true,
                sprint:sprint
            });
        });
    });
};

/* スプリントの心がけを更新する */
exports.update_keep_in_mind = function (req, res) {
    var body = req.body;
    Sprint.findById(body._id, function (sprint) {
        if (!sprint) {
            res.json({
                success:false
            });
            return;
        }
        sprint.keep_in_mind_0 = body.keep_in_mind_0;
        sprint.keep_in_mind_1 = body.keep_in_mind_1;
        sprint.keep_in_mind_2 = body.keep_in_mind_2;
        sprint.update(function () {
            res.json({
                success:true,
                sprint:sprint
            });
        });
    });
};

/* スプリントを削除する */
exports.remove = function (req, res) {
    var body = req.body;
    Sprint.findById(body._id, function (sprint) {
        sprint.remove(function () {
            res.json({
                success:true
            });
        });
    });
};


