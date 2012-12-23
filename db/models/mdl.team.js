/*
 * チーム情報
 */

var util = require('../../util'),
    Model = require('./mdl.prototype.js');

var Team = exports = module.exports = function(data){
    var s = this;
    util.obj.deepCopy(s.defaultValue, s);
    util.obj.deepCopy(data, s);
    if(!s.members) s.members = [];
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

/* 名称による検索 */
Team.findByName = function(name, callback){
    var s = this;
    return s.findByCondition({
        name:name
    }, function(data){
        callback.call(s, data && data.length && data[0] || null);
    });
};


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


/* 有効かどうか */
Team.prototype.isValid = function(){
    var s = this;
    return !!(s.name);
};
