/* logic処理関数群
 * 同じディレクトリ内のファイルを全部exportsする。
 * 例えば logic.format.js は file という名前になり、
 * 使うときは require('./logic').format　みたいに呼べる。
 */

var fs = require('fs');
fs.readdirSync(__dirname).forEach(function (file) {
    // ディレクトリ内のファイルを全部漁る。
    var isSelf = __filename.match(new RegExp(file + '$'));
    if (isSelf) return;

    var name = file
        .replace(/\.js$/, '')
        .replace(/^lgc\./, '');
    exports[name] = require('./' + file);
});
