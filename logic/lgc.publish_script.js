/*
 * クライアントスクリプトを吐き出すロジック
 *
 */

var util = require('../util'),
    fs = require('fs');

const publicDir = __dirname + '/../public/javascripts/';


/* ファイルをコピーして公開する */
exports.copyAndPublish = function(src, publishName){
    var publishPath = publicDir + (publishName || util.file.getFileName(src));
    util.file.copy(src, publishPath);
};

/* ファイルを変更して公開する */
exports.convertAndPublish = function(src, publishName, converter){
    var publishPath = publicDir + (publishName || util.file.getFileName(src));
    util.file.copy(src, publishPath, function () {
        util.file.convert(publishPath, converter);
    });
};

/* ファイルを作成して公開する*/
exports.createAndPublish = function(file, content){
    util.file.write([publicDir, file].join('/'), content);
};

/* 引数で渡された名前をスラッシュでくっつける。*/
exports.joinPath = function(/* names */){
    var path = '';
    for(var i=0; i<arguments.length; i++){
        if(path) path += '/';
        path += arguments[i];
    }
    return path;
};

var joinPath = exports.joinPath;

/* ディレクトリ内のスクリプトファイルをmin化する */
var uglifyScriptsInDir = function(dir){
    fs.readdir(dir, function (err, files) {
        if(err) throw err;
        files && files.forEach(function (file) {
            var path = joinPath(dir, file);
            fs.stat(path, function(err, stat){
                if(err) throw err;
                if(stat.isDirectory()){
                    uglifyScriptsInDir(path);
                } else {
                    var min = file.match(/\.min\.js$/);
                    if (min) return;
                    fs.readFile(path, 'utf-8', function (err, content) {
                        var minFilePath = path.replace(/\.js/, '.min.js');
                        fs.writeFile(minFilePath, util.file.uglifyScript(content));
                    });
                }
            });
        });
    });
};

/* 全てのクライアントスクリプトをmin化する */
exports.uglifyAllClientScripts = function(){
    uglifyScriptsInDir(publicDir);
};

/* ディレクトリ内のminファイルを削除する */
var removeMinScriptInDir = function(dir){
    fs.readdir(dir, function(err, files){
        if(err) throw err;
        files && files.forEach(function(file){
            var path = joinPath(dir, file);
            fs.stat(path, function(err, stat){
               if(err) throw err;
                if(stat.isDirectory()){
                    removeMinScriptInDir(path);
                } else {
                    var min = file.match(/\.min\.js$/);
                    if(min){
                        fs.unlink(path, function(err){
                            if(err) throw err;
                        });
                    }
                }
            });
        });
    });
};
/* 全てのmin化されたクライアントスクリプトを削除する */
exports.removeAllClientMinScript = function(){
    removeMinScriptInDir(publicDir);
};