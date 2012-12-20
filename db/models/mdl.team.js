/*
 * チーム情報
 */

var util = require('../../util'),
    Model = require('./mdl.prototype.js');

var Team = exports = module.exports = function(data){
    var s = this;
    util.obj.deepCopy(s.defaultValue, s);
    util.obj.deepCopy(data, s);
};

Team.prototype.defaultvalue = {
    /* チーム名 */
    name:null,
    /* メンバー */
    members:[]
};
(function(Prototype){
    Team.prototype = new Prototype();
    for(var name in Prototype){
        if (!Prototype.hasOwnProperty(name)) continue;
        Team[name] = Prototype[name];
    }
})(Model);


var Member = exports.Member = function(data){
    var s = this;
    util.obj.deepCopy(s.defaultValue, s);
    util.obj.deepCopy(data, s);
};
Member.prototype.defaultValue = {
    /* メンバ名 */
    name:null
};

/* メンバーを追加する */
Team.prototype.addMember = function(member, callback){
    var s = this;
    s.members.push(member);
    s.update(callback);
};

