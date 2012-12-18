/* GETクエリ */
var util = require('../util');

exports = module.exports = (function () {
    var Query = function (data) {
        var s = this;
        util.obj.deepCopy(data, s);
    };
    Query.prototype.toQueryString = function () {
        var s = this,
            str = "";
        for (var key in s) {
            if (!s.hasOwnProperty(key)) continue;
            if(str) str += '&';
            str += [key, s[key]].join('=');
        }
        return str;
    };
    return Query;

})();

