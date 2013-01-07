/*
 *
 */

var parser = require("node-xml-lite");

exports.xml2Obj = function(xml){

    function childsToObj(childs){
        var result = {};
        childs && childs.forEach(function(child){
            if(typeof child === 'string'){
                result = child;
                return;
            }
            var name = child.name,
                obj = childsToObj(child.childs);
            if(result[name]){
                if(result[name] instanceof Array){
                } else {
                    result[name] = [result[name]];
                }
                result[name].push(obj);
            } else {
                result[name] = obj;
            }
            return true;
        });
        return result;
    }
    var obj = parser.parseString(xml);
    var result = {};
    result[obj.name] = childsToObj(obj.childs);
    return result;
};

exports.xml2Json = function(xml){
    var obj = exports.xml2Obj(xml);
    return JSON.stringify(obj);
};