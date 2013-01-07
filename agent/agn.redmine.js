/*
 * agent for redmine
 */

var Agent = require('./agn.prototype.js'),
    util = require('../util'),
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

RedmineAgent.conf = conf;

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
        var json = JSON.parse(body);
        callback.call(s, true, json);
    });
};

RedmineAgent.prototype.getIssueStatuses = function (callback) {
    var s = this,
        url = conf.url.base + '/issue_statuses';
    s.get(url, function (res, body, $) {
        try {
            var data = [];
            $('#content').find('table.list').find('tbody').find('tr').each(function () {
                var tr = $(this);
                var a = tr.find('a');
                var id = a.eq(0).attr('href')
                    .replace('/redmine/issue_statuses/edit/', '');
                data.push({
                    id:id,
                    name:a.eq(0).text(),
                    closed:!!tr.find('td').eq(2).find('img').length
                });
            });
            callback && callback.call(s, true, data);
        } catch (e) {
            console.error(e);
            callback && callback.call(s, false);
        }

    });
};
RedmineAgent.prototype.getTrackers = function (callback) {
    var s = this,
        url = conf.url.base + '/trackers';
    s.get(url, function (res, body, $) {
        try {
            var data = [];
            $('#content').find('table.list').find('tbody').find('tr').each(function () {
                var tr = $(this);
                var a = tr.find('a');
                var id = a.eq(0).attr('href')
                    .replace('/redmine/trackers/edit/', '');
                data.push({
                    id:id,
                    name:a.eq(0).text()
                });
            });
            callback && callback.call(s, true, data);
        } catch (e) {
            console.error(e);
            callback && callback.call(s, false);
        }
    });
};

RedmineAgent.prototype.getProjects = function (callback) {
    var s = this,
        url = conf.url.base + '/projects.xml';
    s.get(url, function (res, body) {
        try {
            if (res.statusCode === 404) throw new Error(404);
            var data =util.xml.xml2Obj(body);
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

RedmineAgent.prototype.getTimeTrack = function (version_id, callback) {
    var s = this,
        url = [conf.url.base, 'versions/show', version_id].join('/');
    s.get(url, function (res, body, $) {
        try {
            if (res.statusCode === 404) throw new Error(404);
            var table = $('#version-summary').find('fieldset').eq(0).find('table'),
                tr = table.find('tr');

            var extractNumber = util.string.extractNumber;
            var data = {
                estimated:extractNumber(tr.eq(0).find('td').eq(1).text()) || 0,
                spent:extractNumber(tr.eq(1).find('td').eq(1).text()) || 0
            };
            callback && callback.call(s, true, data);
        } catch (e) {
            console.error(e);
            callback && callback.call(s, false);
        }
    });
};

RedmineAgent.prototype.getIssuePriorities = function (callback) {
    var s = this,
        url = [conf.url.base, 'enumerations'].join('/');
    s.get(url, function (res, body, $) {
        try {
            if (res.statusCode === 404) throw new Error(404);
            var data = {};

            var table = $('#content').find('table').eq(1);
            table.find('tr').each(function () {
                var tr = $(this),
                    td = tr.find('td');
                if (!td.length) return;
                var id = td.eq(0).find('a').eq(0).attr('href').replace('/redmine/enumerations/edit/', '');
                data[id] = {
                    id:id,
                    name:td.eq(0).find('a').eq(0).text(),
                    isDefault:!!td.eq(1).find('img').length,
                    active:!!td.eq(2).find('img').length,
                };
            });
            callback && callback.call(s, true, data);
        } catch (e) {
            console.error(e);
            callback && callback.call(s, false);
        }
    });
};
//
//
//new RedmineAgent().login(conf.admin, function () {
//    var s = this;
//    s.getIssuePriorities(function () {
//        console.log(arguments);
//    });
//});