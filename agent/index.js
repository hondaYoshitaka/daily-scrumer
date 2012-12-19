var fs = require('fs'),
    util = require('../util');

function getTypeName(name){
    return util.string.toUpperInitial(util.string.underscore2Camel(name));
}

fs.readdirSync(__dirname).forEach(function (file) {
    // ディレクトリ内のファイルを全部漁る。
    var isSelf = __filename.match(new RegExp(file + '$'));
    if (isSelf) return;

    var name = file
        .replace(/\.js$/, '')
        .replace(/^agn\./, '');
    if(name == 'prototype') return;
    name = getTypeName(name);
    exports[name] = require('./' + file);
});