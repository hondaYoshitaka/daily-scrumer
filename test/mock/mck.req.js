/* mockリクエスト*/

var util = require('../../util');

var defaultValue = {
    params:{},
    body:{},
    session:{},
    flash:function(){}
};

// new して使う
exports = module.exports = function (data) {
    var s = this;
    util.obj.deepCopy(defaultValue, s);
    if(data) util.obj.deepCopy(data, s);
};
