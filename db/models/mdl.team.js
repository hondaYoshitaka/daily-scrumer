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