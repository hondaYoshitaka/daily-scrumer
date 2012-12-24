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
        var form = {
            username:auth.username,
            password:auth.password,
            authenticity_token:token
        };
        s.post(conf.url.login,function (res, body, $) {
            if(res.statusCode == '411'){
                console.error('failed to login');
                callback.call(s, false);
                return;
            }
            var err = !!$('.flash.error').html();
            var success = !err;
            if (!success) {
                callback && callback.call(s, success);
                return;
            }
            function loginDone(res, body, $) {
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
            }
            if(res.headers.location){
                s.get(res.headers.location, loginDone);
            } else {
                callback.apply(s, arguments);
            }
        },{
            "Content-Length":JSON.stringify(form).length
        }).form(form);
    });
};

RedmineAgent.prototype.logout = function (callback) {
    var s = this;
    return s.get(conf.url.logout, function () {
        s.cookie = new Agent.Cookie(); //kill session
        callback.call(s, true);
    });
};

RedmineAgent.prototype.getIssue = function(condition, callback){
    var s = this,
        url = conf.url.base + '/issues.json',
        query = new RedmineAgent.Query(condition).toQueryString();
    s.get([url, query].join('&'), function(res, body){
        console.log('body', body);
        var json = {};//TODO
        callback.call(s, true, json);
    });

};

//new RedmineAgent().login(conf.auth, function (success) {
//
//});