/*
 * 初期データ。DBが空の時にロードする
 */


var fs = require('fs'),
    model = require('../../models'),
    util = require('../../../util');

function getTypeName(name){
    return util.string.toUpperInitial(util.string.underscore2Camel(name));
}

exports.load = function(){
    fs.readdirSync(__dirname).forEach(function (file) {
        // ディレクトリ内のファイルを全部漁る。
        var isSelf = __filename.match(new RegExp(file + '$'));
        if (isSelf) return;

        var isLaunchData = file.match(/^lnc\./);
        if(!isLaunchData) return;
        var name = file
            .replace(/\.js$/, '')
            .replace(/^lnc\./, '');


        var typeName = getTypeName(name);
        var Model = model[typeName];
        Model.countAll(function(count){
           if(count) return;
            var data = require('./' + file);
            data.forEach(function(data){
                new Model(data).save();
            });
            console.log('launch data loaded for', [typeName]);
        });

    });
};
