/*
 * スプリント情報
 */

var util = require('../../util'),
    Model = require('./mdl.prototype.js');

var Sprint = exports = module.exports = function(data){
    var s = this;
    util.obj.deepCopy(s.defaultValue, s);
    util.obj.deepCopy(data, s);
};

Sprint.prototype.defaultValue = {
    /* スプリント名 */
    name:null,
    /* スプリント番号 */
    number:null
};

(function(Prototype){
    Sprint.prototype = new Prototype();
    for(var name in Prototype){
        if (!Prototype.hasOwnProperty(name)) continue;
        Sprint[name] = Prototype[name];
    }
})(Model);
