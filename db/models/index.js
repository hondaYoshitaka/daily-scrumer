var fs = require('fs'),
    util = require('../../util');

function getTypeName(name){
    return util.string.toUpperInitial(util.string.underscore2Camel(name));
}

fs.readdirSync(__dirname).forEach(function (file) {
    // ディレクトリ内のファイルを全部漁る。
    var isSelf = __filename.match(new RegExp(file + '$'));
    if (isSelf) return;
    var name = file
        .replace(/\.js$/, '')
        .replace(/^mdl\./, '');
    if(name === 'prototype') return;
    if(name === 'secondary'){
        fs.readdirSync(__dirname + "/secondary").forEach(function(file){
            var name = file
                .replace(/\.js$/, '')
                .replace(/^mdl\.sc\./, '');
            var typeName = getTypeName(name);
            exports[typeName] = require('./secondary/' + file);
        });
        return;
    }
    if(name === 'bot'){
        fs.readdirSync(__dirname + "/bot").forEach(function(file){
            var name = file
                .replace(/\.js$/, '')
                .replace(/^mdl\.bt\./, '');
            var typeName = getTypeName(name);
            exports[typeName] = require('./bot/' + file);
        });
        return;
    }
    var typeName = getTypeName(name);
    exports[typeName] = require('./' + file);
});

