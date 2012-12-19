/*
 * agent for redmine
 */

var Agent = require('./agn.prototype.js'),
    util = require('../util'),
    conf = require('../conf');

var RedmineAgent = exports = module.exports = function (data) {
    var s = this;
    if(data){
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
            callback && callback.call(s, success);
        }).form({
                username:auth.username,
                password:auth.password,
                authenticity_token:token
            });
    });
};

RedmineAgent.prototype.logout = function(callback){
    var s = this;
    return s.get(conf.url.logout, function(){
        s.cookie = new Agent.Cookie(); //kill session
        callback.call(s, true);
    });
};

//new RedmineAgent().login(conf.auth, function (success) {
//
//});