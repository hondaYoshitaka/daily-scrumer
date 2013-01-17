/* チームルール */

var util = require('../../util'),
    Model = require('./mdl.prototype.js');

var Rule = exports = module.exports = function (data) {
    var s = this;
    util.obj.deepCopy(s.defaultValue, s);
    util.obj.deepCopy(data, s);
};

(function (Prototype) {
    Rule.prototype = new Prototype();
    util.obj.copy(Prototype, Rule);
})(Model);

Rule.prototype.defaultValue = {
    team_name:'',
    style_urls:[]
};

Rule.findByTeamName = function(team_name, callback){
    var s = this;
    return s.findOneByCondition({
        team_name:team_name
    }, callback);
};