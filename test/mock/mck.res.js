/*
 * mockレスポンス
 */

var util = require('../../util');


var defaultValue = {
    redirect:function () {
    },
    render:function () {
    },
    send:function(){

    },
    json:function(){

    },
    locals:{
        lang:'ja'
    }
};

// new して使う
exports = module.exports = function (data) {
    var s = this;
    util.obj.deepCopy(defaultValue, s);
    if(data)util.obj.deepCopy(data, s);
};