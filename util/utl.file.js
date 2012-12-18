/* file 周りのutil　*/
var fs = require('fs'),
    token = require('./utl.token.js'),
    uglify = require("uglify-js");

/* 拡張子を取得する */
exports.getExtension = function (file) {
    var match = file && file.match(/(\.)([^\.]*$)/);
    return match && match.length > 2 && match[2];
};

/* ファイル名を取得する */
exports.getFileName = function (path) {
    var match = path && path.match(/[^\/]*$/);
    return match && match[0];
};

/* 拡張子をつける。既についてたら無視する */
exports.setExtension = function (file, extension) {
    if (!file.match(new RegExp(extension + '$'))) {
        file += '.' + extension;
    }
    return file;
};

/* fileコピー。絶対パスを渡すこと！ */
exports.copy = function (src, dst, callback) {
    fs.readFile(src, function (err, data) {
        if (err) throw err;
        exports.write(dst, data, callback);
    });
};

/* fileの書き込み処理 */
exports.write = function (path, content, callback) {
    fs.writeFile(path, content, function (err) {
        if (err) throw err;
        callback && callback.call(this, path);
    });
};

/* スクリプトを圧縮する */
exports.uglifyScript = function (script) {
    var jsp = uglify.parser;
    var pro = uglify.uglify;
    var ast = jsp.parse(script); // parse code and get the initial AST
    ast = pro.ast_mangle(ast); // get a new AST with mangled names
    ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
    return pro.gen_code(ast); // compressed code here
};


/* ファイルの中身を書き換える */
exports.convert = function (file, converter) {
    if (!fs.existsSync(file)) {
        throw "'" + file + "'is file not found";
    }
    exports.readFileAsString(file, function (content) {
        content = converter.call(this, content);
        fs.writeFile(file, content);
    });
};

/* ファイルの中身を文字列として読み込む */
exports.readFileAsString = function (file, callback) {
    fs.readFile(file, 'utf-8', function (err, content) {
        if (err) throw  err;
        callback.call(this, content);
    });
};

/* ファイルの存在チェック */
exports.exists = function (file) {
    if(!file) return false;
    return fs.existsSync(file);
};
/* ファイルのディレクトリ判定 */
exports.isDir = function (file) {
    return fs.statSync(file).isDirectory();
};

/* ディレクトリ内のファイルのパスを全て取得する */
exports.getAllFilePaths = function (dir) {
    var files = [];
    fs.readdirSync(dir).forEach(function (file) {
        var path = [dir, file].join('/');
        if (exports.isDir(path)) {
            files = files.concat(exports.getAllFilePaths(path));
        } else {
            files.push(path);
        }
    });
    return files;
};

/*
 * 行単位でファイルの中身を読み込む。
 * 一行ごとにcallbackが呼ばれる。
 * callback(line, isLast);
 */
exports.eachLine = function (file, callback) {
    if (!exports.exists) throw new Error('file not found');

    var chunk = '';
    var stream = fs
        .createReadStream(file, {encoding:'utf8'});
    stream
        .on('data', function (data) {
            var s = this;
            chunk += data;
            var split = chunk.split(/\n/);
            if (split.length) {
                chunk = split.pop();
                split.forEach(function (line) {
                    callback.call(s, line, false);
                });
            }
        })
        .on('end', function () {
            var s = this;
            callback.call(s, chunk || '', true);
        });
};
/*
 * 行数を指定して行単位で読み込む
 */
exports.readLines = function (file, start, amount, callback) {
    if (arguments.length == 3) {
        callback = arguments[2];
        amount = undefined;
    }
    var count = 0,
        end = start + amount,
        started = false,
        finished = false;

    exports.eachLine(file, function(line, isLast){
        if(finished) return;
        var s = this;
        count ++;
        if(isLast || (count >= end)){
            finished = true;
            s.destroy();
            callback.call(s, started?line:'', true);
            return;
        }
        if(count <= start) return;
        started = true;
        callback.call(s, line, false);
    });
};

/* 一時ファイルに出力する */
exports.createTmpFile = function(content, callback){
    var file = __dirname + '/../work/file' +  token.generate();
    fs.writeFile(file, content, function(err){
        var s = this;
        if(err) {
            callback.call(s, err);
        } else {
            callback.call(s, null, file);
        }
    });
};