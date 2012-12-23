/*
 * スプリント目標
 */
var util = require('../../util'),
    Model = require('./mdl.prototype.js');

var KeepInMind = exports = module.exports = function (data) {
    var s = this;
    util.obj.deepCopy(s.defaultValue, s);
    util.obj.deepCopy(data, s);
};

KeepInMind.prototype.defaultvalue = {
    /* チーム */
    team:null,
    /* sprint */
    sprint:null,
    /* 目標 */
    words:[]
};
(function (Prototype) {
    KeepInMind.prototype = new Prototype();
    for (var name in Prototype) {
        if (!Prototype.hasOwnProperty(name)) continue;
        KeepInMind[name] = Prototype[name];
    }
})(Model);

/* チームとスプリントによって検索する */
KeepInMind.prototype.findByTeamSprint = function (team, sprint, callback) {
    var s = this;
    return s.findByCondition({
        team:team,
        sprint:sprint
    }, function (data) {
        callback.call(s, data && data.length && data[0] || null);
    });
};
