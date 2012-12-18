

var fs = require('fs');

fs.readdirSync(__dirname).forEach(function (file) {
    // ディレクトリ内のファイルを全部漁る。
    var isSelf = __filename.match(new RegExp(file + '$'));
    if (isSelf) return;

    var name = file
        .replace(/\.js$/, '')
        .replace(/^cnf\./, '');
    exports[name] = require('./' + file);
});