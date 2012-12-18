/*
 * agent for redmine
 */

var Agent = require('./agn.prototype.js'),
    conf = require('../conf');

var RedmineAgent = exports = module.exports = function () {
    var s = this;
    s.cookie = new Agent.Cookie();
};

(function (Prototype) {
    RedmineAgent.prototype = new Prototype();
    for (var name in Prototype) {
        if (!Prototype.hasOwnProperty(name)) continue;
        RedmineAgent[name] = Prototype[name];
    }
})(Agent);

RedmineAgent.prototype.login = function (auth, callback) {
    var s = this;
    s.get(conf.url.login, function (res, body, $) {
        var token = $('input[name=authenticity_token]').attr('value');
        s.post(conf.url.login,function (res, body, $) {
            callback && callback.call(s);
        }).form({
                username:auth.username,
                password:auth.password,
                authenticity_token:token
            });
    });
};

new RedmineAgent().login(conf.auth, function () {

});