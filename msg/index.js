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







