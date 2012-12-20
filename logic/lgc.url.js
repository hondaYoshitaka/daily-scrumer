/* urlを算出する処理 */
var util = require('../util'),
    fs = require('fs');

exports = module.exports = (function(context){
    /* jade上でのリソース読み込み先を計算する関数 */
    var url = function (path) {
        return context + path;
    };
    /* cssファイルのパスを返す関数 */
    url.css = function (name) {
        name = util.file.setExtension(name, 'css');
        return url('/stylesheets/' + name);
    };
    url.css.game = function(name){
        return url.css('game/' + name);
    };
    /* jsファイルのパスを返す関数 */
    url.js = function (name) {
        name = util.file.setExtension(name, 'js');
        if (url.use_min) {
            var min = name.match(/\.min\.js$/);
            if (!min) {
                name = name.replace(/\.js$/, '.min.js');
            }
        }
        return url('/javascripts/' + name);
    };
    url.js.game = function(name){
        return url.js('game/' + name);
    };
    /* 画像ファイルのパスを返す関数 */
    url.img = function (name) {
        return url('/images/' + name);
    };
    return url;
})('');

/* 公開ディレクトリ */
exports.publicDir = __dirname + '/../public';

var publicFiles = fs.readdirSync(exports.publicDir);
/* publicディレクトリへのアクセスかどうかの判定 */
exports.isPublic = function(path){
    for(var i=0; i<publicFiles.length; i++){
        var publicFile = publicFiles[i];
        if(publicFile.match(/^\./)) continue; //隠しファイルは無視する
        var match = path.match(new RegExp("^/" +publicFile));
        if(match) return true;
    }
    return false;
};