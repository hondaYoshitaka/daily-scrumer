/* テストで使うモック*/
var fs = require('fs'),
    util = require('../../util');

/* ディレクトリ内のファイルを全部漁ってexportsする*/

fs.readdirSync(__dirname).forEach(function (file) {
    var isSelf = __filename.match(new RegExp(file + '$'));
    if (isSelf) return;
    switch(file){
        case 'html':
        case 'file':
            return;
    }
    var name = file
        .replace(/^mck\./, '')
        .replace(/\.[^\.]*$/, '');//remove extensions
    //大文字はじまり。
    name = util.string.toUpperInitial(util.string.underscore2Camel(name));
    exports[name] = require('./' + file);
});