/* util関数群
 * 同じディレクトリ内のファイルを全部exportsする。
 * 例えば util.file.js は file という名前になり、
 * 使うときは require('./util').file　みたいに呼べる。
 */
var fs = require('fs');

fs.readdirSync(__dirname).forEach(function (file) {
    // ディレクトリ内のファイルを全部漁る。
    var isSelf = __filename.match(new RegExp(file + '$'));
    if (isSelf) return;

    var name = file
        .replace(/\.js$/, '')
        .replace(/^utl\./, '');
    exports[name] = require('./' + file);
});

