
var fs = require('fs');

// routesディレクトリ下のjsを全部読み込んでexportsする。
// ファイル名がそのままキーになる。
fs.readdirSync(__dirname).forEach(function (file) {
    var isSelf = __filename.match(new RegExp(file + '$'));
    if (isSelf) return;
    var name = file
        .replace(/^rt\./, '')
        .replace(/\.[^\.]*$/, '');
    exports[name] = require('./' + file);
});

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

