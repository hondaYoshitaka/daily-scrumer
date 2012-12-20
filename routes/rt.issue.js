/*
 * 不具合関連s
 */

var RedmineAgent = require('../agent')['Redmine'],
    util = require('../util');

/* */
exports.count = function(req, res){
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