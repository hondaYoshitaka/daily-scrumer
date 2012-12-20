/*
 * メッセージリソース
 */


var fs = require('fs');
fs.readdirSync(__dirname).forEach(function (file) {
    var isSelf = __filename.match(new RegExp('^' + file + '$'));
    if (isSelf) return;
    var name = file
        .replace(/^msg\./, '')
        .replace(/\.[^\.]*$/, '');
    exports[name] = require('./' + file);
});



exports.labels = {
    login:{
        caption:'login',
        username:'username',
        password:'password'
    },
    daily:{
        keep_in_mind:'Trial for this sprint'
    }
};

exports.btn = {
    close:'×',
    add:'+',
    login:'login',
    logout:'logout'
};

exports.err = {
    login_fail:'failed to login'
};