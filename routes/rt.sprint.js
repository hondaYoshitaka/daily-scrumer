/*
 * プロジェクト情報
 */

var RedmineAgent = require('../agent')['Redmine'],
    util = require('../util'),
    logic = require('../logic'),
    db = require('../db'),
    Team = db.models['Team'],
    Sprint = db.models['Sprint'],
    Story = db.models['Story'],
    Calendar = db.models['Calendar'];

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
                (issues.issues || issues).forEach(function (bug) {
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
    var sprint_number = req.query.sprint_number,
        team_name = req.query.team_name,
        team_id = req.query.team_id;

    var data = {
        total:0,
        open:0,
        modified:0,
        done:0,
        modified_assign:{}
    };
    Sprint.findOneByCondition({
        team_name:team_name,
        number:Number(sprint_number)
    }, function (sprint) {
        if (!sprint) {
            failJson(res);
            return;
        }
        getBugs(team_id, sprint, function (sucess, bugs, team) {
            if (!sucess) {
                failJson(res);
                return;
            }
            bugs.forEach(function (bug) {
                data.total++;
                var status = team.getStatus(bug);
                if (status) {
                    switch (status.report_as) {
                        case 'done':
                            data.done++;
                            break;
                        case 'modified':

                            var assigned_id = bug.assigned_to_id || bug.assigned_to && bug.assigned_to.id || null;
                            if (assigned_id) {
                                data.modified_assign[assigned_id] = true;
                            }
                            data.modified++;
                            break;
                        default:
                            data.open++;
                            break;
                    }
                } else {
                    console.error('status not find', bug.status_id);
                }
            });
            data.success = true;
            res.json(data);
        });
    });
};

/* タスク時間の状況を取得する */
exports.task_time = function (req, res) {
    var sprint_number = req.query.sprint_number,
        team_name = req.query.team_name,
        team_id = req.query.team_id;

    var data = {
        estimated:0,
        consumed:0,
        remain:0
    };
    Sprint.findOneByCondition({
        team_name:team_name,
        number:Number(sprint_number)
    }, function (sprint) {
        if (!sprint) {
            failJson(res);
            return;
        }
        var versions = sprint.redmine_versions;
        if (!versions) {
            failJson(res);
            return;
        }
        getTasks(team_id, sprint, function (success, tasks, team) {
            if (!success) {
                failJson(res);
                return;
            }
            tasks.forEach(function (task) {
                var time = (task.estimated_hours || 0);
                data.estimated += time;
                var status = team.getStatus(task);
                if (!status) {
                    console.error('status not found for id', task);
                    return;
                }
                if (status.report_as != 'done') {
                    var ratio = task.done_ratio === undefined ?
                        1 : ((100 - Number(task.done_ratio)) / 100)
                    data.remain += time * ratio;
                }
            });

            getTimeTracks(versions, function (success, timeTrack) {
                if (!success) {
                    failJson(res);
                    return;
                }
                data.consumed = timeTrack.spent;
                data.success = true;
                data.remain = Number(data.remain.toFixed(1));
                res.json(data);
            });
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
    if (!body._id) {
        failJson(res);
        return;
    }
    Sprint.findById(body._id, function (sprint) {
        if (!sprint) {
            failJson(res);
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

exports.update_days = function (req, res) {
    var body = req.body;
    if (!body._id) {
        failJson(res);
        return;
    }
    Sprint.findById(body._id, function (sprint) {
        if (!sprint) {
            failJson(res);
            return;
        }
        sprint.begin = body.begin;
        sprint.end = body.end;
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

exports.update_work_hours = function (req, res) {
    var body = req.body;
    var valid = body._id && body.day && body.work_hours;
    if (!valid) {
        failJson(res);
        return;
    }
    Sprint.findById(body._id, function (sprint) {
        if (!sprint) {
            failJson(res);
            return;
        }
        var day = util.date.UTC.truncateHours(new Date(body.day));
        sprint.work_hours[day] = body.work_hours;
        sprint.update(function () {
            res.json({
                success:true,
                sprint:sprint
            });
        });
    });
};


exports.in_hurry_bugs = function (req, res) {
    var sprint_number = req.query.sprint_number,
        team_name = req.query.team_name,
        team_id = req.query.team_id;
    var limit = 3, in_hurry_bugs = [];
    Sprint.findOneByCondition({
        team_name:team_name,
        number:Number(sprint_number)
    }, function (sprint) {
        if (!sprint) {
            failJson(res);
            return;
        }
        getBugs(team_id, sprint, function (sucess, bugs, team) {
            if (!sucess) {
                failJson(res);
                return;
            }
            var i = 0;
            while (in_hurry_bugs.length < limit) {
                var bug = bugs[i];
                if (!bug) break;
                var status = team.getStatus(bug);
                if (!status) {
                    console.error('status not found', bug);
                    continue;
                }
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
    });
};

exports.alert_line = function (req, res) {
    var sprint_number = req.query.sprint_number,
        team_id = req.query.team_id,
        team_name = req.query.team_name,
        done_rate = req.query.done_rate,
        today = util.date.truncateHours(util.date.getNow());
    var isValid = !!(sprint_number && team_id && team_name);
    if (!isValid) {
        failJson(res);
        return;
    }
    Sprint.findOneByCondition({
        number:Number(sprint_number),
        team_name:team_name
    }, function (sprint) {
        if (!sprint) {
            failJson(res);
            return;
        }
        Team.findById(team_id, function (team) {
            if (!team) {
                failJson(res);
                return;
            }
            Calendar.findByTeamName(team.name, function (calendar) {
                var ratio = logic.alert_line.assumeLeftOpenTask(
                    Number(done_rate), today, sprint, calendar);
                var color = (function (alert_lines) {
                    var color = '';
                    alert_lines.sort(function (a, b) {
                        return Number(a.percent) - Number(b.percent);
                    }).forEach(function (alert_line) {
                            if (!color) {
                                color = alert_line.color;
                                return;
                            }
                            var over = (ratio * 100) > Number(alert_line.percent);
                            if (over) color = alert_line.color;
                        });
                    return color;
                })(team.alert_lines);
                var passed_days = logic.alert_line.passedDays(today, sprint, calendar),
                    remain_days = logic.alert_line.remainDays(today, sprint, calendar);

                var done_task = (Number(done_rate) * 100) | 0,
                    remain_task = 100 - done_task;
                res.json({
                    success:true,
                    leftOpenTaskAssumeRatio:ratio,
                    color:color,
                    record:{
                        days:passed_days,
                        task:done_task,
                        per_day:(done_task / passed_days) | 0
                    },
                    remain:{
                        task:remain_task,
                        days:remain_days,
                        will_left:(ratio * 100) | 0
                    }

                });
            });
        });
    });
};

exports.stories = function (req, res) {
    var sprint_number = req.query.sprint_number,
        team_name = req.query.team_name,
        team_id = req.query.team_id;
    Sprint.findOneByCondition({
        team_name:team_name,
        number:Number(sprint_number)
    }, function (sprint) {
        if (!sprint) {
            failJson(res);
            return;
        }
        var versions = sprint.redmine_versions;
        if (!versions) {
            failJson(res);
            return;
        }
        getTasks(team_id, sprint, function (success, data) {
            if (!success) {
                failJson(res);
                return;
            }
            Story.findBySprintId(sprint._id, function (saved) {
                data.forEach(function (data) {
                    data.sprint_id = sprint._id;
                    data.redmine_id = data.id;
                    delete data.id;
                    for (var i = 0; i < saved.length; i++) {
                        var story = saved[i];
                        var hit = story.redmine_id == data.redmine_id;
                        if (hit) {
                            util.obj.deepCopy(story, data);
                            break;
                        }
                    }
                    data.link = [RedmineAgent.conf.url.base, 'issues', data.redmine_id].join('/');
                });
                var stories = data.sort(function (a, b) {
                    return Number(b.priority && b.priority.id || b.priority_id);
                    -Number(a.priority && a.priority.id || a.priority_id);
                });
                res.json({
                    success:true,
                    stories:stories
                });
            });
        });
    });
};