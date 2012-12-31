/*
 * プロジェクト情報
 */

var RedmineAgent = require('../agent')['Redmine'],
    util = require('../util'),
    db = require('../db'),
    Team = db.models['Team'],
    Sprint = db.models['Sprint'];

function failJson(res) {
    res.json({
        success:false
    });
}

/* 不具合数を取得する */
exports.count_bugs = function (req, res) {
    var sprint = req.query.sprint,
        team_id = req.query.team_id,
        versions = sprint.redmine_versions;
    if (!versions) {
        failJson(res);
        return;
    }
    var data = {
        total:0,
        open:0,
        modified:0,
        done:0
    };
    Team.findById(team_id, function (team) {
        var agentReqCount = 0;
        var tracker_ids = (function () {

        })();
        versions.forEach(function (version) {
            agentReqCount++;
            RedmineAgent.admin.getIssue({
                project_id:version.project,
                fixed_version_id:version.id,
                status_id:'*'
            }, function (sucess, bugs) {
                if (!sucess) {
                    fail && fail();
                    fail = null;
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
                agentReqCount--;
                if (agentReqCount == 0) {
                    data.success = true;
                    res.json(data);
                }
            });
        });
    });

};

/* タスク時間の状況を取得する */
exports.task_time = function (req, res) {
    //TODO
    res.json({
        success:true,
        estimated:130,
        remain:80,
        consumed:80
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


