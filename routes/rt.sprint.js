/*
 * プロジェクト情報
 */

var RedmineAgent = require('../agent')['Redmine'],
    util = require('../util'),
    db = require('../db'),
    Team = db.models['Team'],
    Sprint = db.models['Sprint'];

function getTimeTracks(versions, callback) {
    var result = {
        consumed:0,
        spent:0
    };
    var agentReqCount = 0,
        abort = false;
    if (!versions.length) {
        callback(true, result);
    }
    versions.forEach(function (version) {
        agentReqCount++;
        RedmineAgent.admin.getTimeTrack(version.id, function (success, data) {
            if (abort) return;
            if (!success) {
                abort = true;
                callback(false);
                return;
            }
            result.consumed += data.consumed;
            result.spent += data.spent;
            agentReqCount--;
            if (agentReqCount == 0) {
                callback(true, result);
            }
        });
    });

}

/* get issues from redmine */
function getIssues(trackers, versions, callback) {
    var result = [];
    var agentReqCount = 0,
        abort = false;
    if (!versions.length || !trackers.length) {
        callback(true, result);
    }
    trackers.forEach(function (tracker_id) {
        versions.forEach(function (version) {
            agentReqCount++;
            RedmineAgent.admin.getIssue({
                project_id:version.project,
                fixed_version_id:version.id,
                status_id:'*',
                tracker_id:tracker_id,
                sort:'priority:desc'
            }, function (success, issues) {
                if (abort) return;
                if (!success) {
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
        consumed:0,
        remain:0
    };
    getTasks(team_id, sprint, function (sucess, tasks, team) {
        if (!sucess) {
            failJson(res);
            return;
        }
        tasks.forEach(function (task) {
            var time = (task.estimated_hours || 0);
            data.estimated += time;
            var status = team.issue_statuses[String(task.status_id)];
            if (status.report_as != 'done') {
                data.remain += time;
            }
        });

        getTimeTracks(versions, function (success, timeTrack) {
            if (!success) {
                failJson(res);
                return;
            }
            data.consumed = timeTrack.spent;
            data.success = true;
            res.json(data);
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


exports.in_hurry_bugs = function (req, res) {
    var sprint = req.query.sprint,
        team_id = req.query.team_id;
    var limit = 3, in_hurry_bugs = [];
    getBugs(team_id, sprint, function (sucess, bugs, team) {
        if (!sucess) {
            failJson(res);
            return;
        }
        var i = 0;
        while (in_hurry_bugs.length < limit) {
            var bug = bugs[i];
            var status = team.issue_statuses[String(bug.status_id)];
            switch (status.report_as) {
                case 'done':
                case 'modified':
                    break;
                default :
                    bug.url = [RedmineAgent.conf.url.base, 'issues', bug.id].join('/');
                    var enums = RedmineAgent.admin.enumerations;
                    if (enums && enums.issuePriorities) {
                        bug.priority = enums.issuePriorities[bug['priority_id']];
                    }
                    in_hurry_bugs.push(bug);
                    break;
            }
            i++;
        }
        var urls = (function (base) {
            var urls = [];
            team.redmine_projects.forEach(function (project) {

                var url = [base, 'projects', project, 'issues'].join('/');
                urls.push(url);
            });
            return urls;
        })(RedmineAgent.conf.url.base);
        res.json({
            success:true,
            in_hurry_bugs:in_hurry_bugs,
            urls:urls
        });
    });
};