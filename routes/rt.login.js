/*
 * ログイン関連
 */

var RedmineAgent = require('../agent')['Redmine'];

/* 認証実行 */
exports.auth = function (req, res) {
    var data = req.body;
    var auth = {
        username:data.username,
        password:data.password
    };
    var agent = new RedmineAgent();
    agent.login(auth, function (sucess) {
        res.json({
            success:sucess
        });
    });
};

/* ログアウト */
exports.logout = function (req, res) {
    res.json({
        success:true
    });
};