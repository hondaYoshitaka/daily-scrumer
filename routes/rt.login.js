/*
 * ログイン関連
 */

var RedmineAgent = require('../agent')['Redmine'],
    util = require('../util');

var User = function(redmineAgent){
    var s = this;
    s.redmineAgent = redmineAgent;
};

/* 認証実行 */
exports.auth = function (req, res) {
    var data = req.body;
    var auth = {
        username:data.username,
        password:data.password
    };
    var agent = new RedmineAgent();
    agent.login(auth, function (sucess, data) {
        var user= new User(agent);
        user.name = auth.username;
        user.projectes = data && data.projects;
        req.session.user = user;
        res.json({
            success:sucess,
            user:user
        });
    });
};

/* ログアウト */
exports.logout = function (req, res) {
    var user = req.session.user;
    if(!user){
        res.json({
            success:false
        });
        return;
    }
    new RedmineAgent(user.redmineAgent).logout(function(sucess){
        req.session.user = null;
        res.json({
            success:sucess
        });
    });
};