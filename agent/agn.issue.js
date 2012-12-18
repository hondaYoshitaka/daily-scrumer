/*
 * agent for redmine
 */

var RedmineAgent = require('./agn.redmine.js'),
    conf = require('../conf');

var IssueAgent = exports = module.exports = function (project) {
    var s = this;
    s.cookie = new RedmineAgent.Cookie();
    s.url = [conf.base, 'projects', project, 'issues'].join('/');
};

(function (Prototype) {
    IssueAgent.prototype = new Prototype();
    for (var name in Prototype) {
        if (!Prototype.hasOwnProperty(name)) continue;
        IssueAgent[name] = Prototype[name];
    }
})(RedmineAgent);