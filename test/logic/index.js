/*
 *  ロジック周りのテスト
 */
var fs = require('fs'),
    util = require('../../util');

describe('logic', function(){

    require('../check_env')();

    var logicDir = '../../logic';
    fs.readdirSync(__dirname + '/' + logicDir).forEach(function(logicFile){
        if(logicFile === 'index.js') return;
        var testFile = 'mch.' + logicFile.replace(/^logic\./, '');
        var exists = fs.existsSync(__dirname + '/' + testFile);
        if(exists){

        } else {
            console.error('/logic/' + logicFile + 'のテスト(/test/logic/' + testFile + ')が見つかりません。');
        }
    });


    fs.readdirSync(__dirname).forEach(function (file) {
        // ディレクトリ内のファイルを全部漁る。
        var isSelf = __filename.match(new RegExp(file + '$'));
        if (isSelf) return;
        require('./' + file);
    });
});