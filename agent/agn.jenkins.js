/*
 * agent for jenkins
 */

var Agent = require('./agn.prototype.js'),
    util = require('../util'),
    conf = require('../conf')['jenkins'];


var JenkinsAgent = exports = module.exports = function (data) {
    var s = this;
    if (data) {
        util.obj.deepCopy(data, s);
        s.cookie = new Agent.Cookie(data.cookie);
    } else {
        s.cookie = new Agent.Cookie();
    }
};

JenkinsAgent.conf = conf;

(function (Prototype) {
    JenkinsAgent.prototype = new Prototype();
    for (var name in Prototype) {
        if (!Prototype.hasOwnProperty(name)) continue;
        JenkinsAgent[name] = Prototype[name];
    }
})(Agent);

JenkinsAgent.prototype.login = function (auth, callback) {
    var s = this;
    if(!auth) auth = conf.auth;
    var form = {
        j_username:auth.j_username,
        j_password:auth.j_password
    }
    s.post('j_acegi_security_check', function(res, body, $){
        if (res.statusCode == '411') {
            console.error('failed to login');
            callback.call(s, false);
            return;
        }
        callback.call(s, true);
    }).form(form);
};

JenkinsAgent.prototype.getWhether = function (url, callback) {
    var s = this;
    var base = (function (url) {
        return [url.protocol, url.host].join('\/\/');
    })(require('url').parse(url))
    s.get(url, function (res, body, $) {
        try {
            var data = [];
            $('#main-panel table#projectstatus').find('tr').each(function (i) {
                if (i === 0) return;
                var tr = $(this),
                    td = tr.find('td');
                var a = tr.find('.model-link').eq(0);

                var name = a.text();
                if (name) {
                    data.push({
                        name:name,
                        img:base + td.eq(1).find('img').attr('src')
                    });
                }
            });
            callback && callback.call(s, true, data);
        } catch (e) {
            console.error(e);
            callback && callback.call(s, false);
        }
    });
};
