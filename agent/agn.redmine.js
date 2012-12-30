/*
 * agent for redmine
 */

var Agent = require('./agn.prototype.js'),
    util = require('../util'),
    XML = require('xml2json'),
    conf = require('../conf').redmine;

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
            if (res.statusCode == '411') {
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

            if (res.headers.location) {
                s.get(res.headers.location, loginDone);
            } else {
                callback.apply(s, arguments);
            }
        }, {
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

RedmineAgent.prototype.getIssue = function (condition, callback) {
    var s = this,
        url = conf.url.base + '/issues.json',
        query = new RedmineAgent.Query(condition).toQueryString();
    s.get([url, query].join('?'), function (res, body) {
        console.log('body', body);
        var json = {};//TODO
        callback.call(s, true, json);
    });
};

RedmineAgent.prototype.getProjects = function (callback) {
    var s = this,
        url = conf.url.base + '/projects.xml';
    s.get(url, function (res, body) {
        try {
            if (res.statusCode === 404) throw new Error(404);
            var data = JSON.parse(XML.toJson(body));
            var success = true;
            callback && callback.call(s, success, data['projects']['project']);
        } catch (e) {
            console.error(e);
            callback && callback.call(s, false);
        }
    });
};

RedmineAgent.prototype.getVersions = function (project_identifier, callback) {
    var s = this,
        url = [conf.url.base, 'projects', project_identifier, 'roadmap'].join('/');
    s.get(url, function (res, body, $) {
        try {
            if (res.statusCode === 404) throw new Error(404);

            var data = [];
            $('h3.version').each(function () {
                $(this).find('a[href]').each(function () {
                    var a = $(this),
                        href = a.attr('href'),
                        text = a.text();
                    var id = href.replace('/redmine/versions/show/', '');
                    data.push({
                        id:id,
                        name:text
                    });
                });
            });
            callback && callback.call(s, true, data);
        } catch (e) {
            console.error(e);
            callback && callback.call(s, false);
        }
    });
};

//
//new RedmineAgent().login(conf.admin, function () {
//    var s = this;
//    s.getVersions('project00', function (success, data) {
//        console.log(success, data);
//    });
//
//});