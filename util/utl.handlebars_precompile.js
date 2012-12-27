/*
 * handlebarsのテンプレートをプリコンパイルする
 */

var compiler = require('handlebars-precompiler'),
    fs = require('fs'),
    fileUtil = require('./utl.file');

var extension = 'hbs';

exports.do = function (watchDir, outFile) {
    if (fileUtil.exists(outFile)) fs.unlinkSync(outFile);


    compiler.do({
        templates:[watchDir],
        output:outFile,
        fileRegex:new RegExp('\.' + extension),
        min:true
    });
    compiler.watchDir(
        watchDir,
        outFile,
        [extension]
    );
};