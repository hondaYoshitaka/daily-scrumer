/*
 * agent for redmine
 */

var Agent = require('./agn.prototype.js'),
    util = require('../util'),
    conf = require('../conf');

var RedmineAgent = exports = module.exports = function (data) {
    var s = this;
    if (data) {
        util.obj.deepCopy(data, s);
        s.cookie = new Agent.Cookie(data.cookie);
    } else {
        s.cookie = new Agent.Cookie();
    }
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
    return s.get(conf.url.login, function (res, body, $) {
        var token = $('input[name=authenticity_token]').attr('value');
        s.post(conf.url.login,function (res, body, $) {
            var err = !!$('.flash.error').html();
            var success = !err;
            if (!success) {
                callback && callback.call(s, success);
                return;
            }
            s.get(res.headers.location, function (res, body, $) {
                var data = {};
                var projects = [];
                var option = $('#quick-search').find('select').find('option');
                for (var i = 0; i < option.length; i++) {
                    var text = option.eq(i).text(),
                        val = option.eq(i).attr('value');
                    if (!val) continue;
                    var key = val
                        .replace(/^\/redmine\/projects\//, "")
                        .replace(/\?.*$/, '');
                    projects.push({
                        key:key,
                        name:text
                    });
                }
                data.projects = projects;
                callback && callback.call(s, success, data);
            });
        }).form({
                username:auth.username,
                password:auth.password,
                authenticity_token:token
            });
    });
};

RedmineAgent.prototype.logout = function (callback) {
    var s = this;
    return s.get(conf.url.logout, function () {
        s.cookie = new Agent.Cookie(); //kill session
        callback.call(s, true);
    });
};

//new RedmineAgent().login(conf.auth, function (success) {
//
//});