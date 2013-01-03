/*
 * event for team
 */

var util = require('../../util'),
    Model = require('./mdl.prototype.js');

var Event = exports = module.exports = function (data) {
    var s = this;
    util.obj.deepCopy(s.defaultValue, s);
    util.obj.deepCopy(data, s);
};

(function (Prototype) {
    Event.prototype = new Prototype();
    util.obj.copy(Prototype, Event);
})(Model);


Event.prototype.defaultValue = {
    /* name of team */
    team_name:null,
    /* date of event */
    date:null,
    /* time of event */
    time:null,
    /* title of event */
    title:null,
    /* detail of event */
    detail:null
};

Event.findByTeamName = function(team_name, callback){
    var s = this;
    return s.findByCondition({
        team_name:team_name
    }, callback).sort({date:-1});
};