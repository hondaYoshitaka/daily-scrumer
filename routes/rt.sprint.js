/*
 * プロジェクト情報
 */

var RedmineAgent = require('../agent')['Redmine'],
    util = require('../util');

/* */
exports.issue_count = function(req, res){

    //TODO
    res.json({
        success:true,
        total:80,
        modified:30,
        done:50
    });
    return;

    var user = req.session.user,
        query = req.query;
    if(!user){
        res.json({
            success:false
        });
        return;
    }
    var agent = new RedmineAgent(user.redmineAgent);
    agent.getIssue({
        project_id:query.project_id
    }, function(success, data){
        res.json({
            success:success,
            count:data.length
        })
    });
};

/* */
exports.task_time = function(req, res){

    //TODO
    res.json({
        success:true,
        estimated:130,
        remain:80,
        consumed:80
    });
    return;
    var user = req.session.user,
        query = req.query;
    if(!user){
        res.json({
            success:false
        });
        return;
    }
};