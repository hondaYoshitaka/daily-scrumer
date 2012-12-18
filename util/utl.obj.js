/* objectのutil */

/* 再帰的コピー。プロトタイプは無視する。functionは複製せずそのまま渡す。 */
exports.deepCopy = function (src, dest) {
    if (!src) return dest;
    if (!dest) return exports.deepClone(src);
    for (var key in src) {
        if (!src.hasOwnProperty(key)) continue;
        if (src[key] instanceof Function) {
            dest[key] = src[key]
        } else if (src[key] instanceof Array) {
            dest[key] = exports.deepCopy(src[key], dest[key] || []);
        } else if (src[key] instanceof Object) {
            dest[key] = exports.deepCopy(src[key], dest[key] || {});
        } else {
            dest[key] = src[key];
        }
    }
    return dest;
};

/* 再帰的クローン。プロトタイプは無視する。 */
exports.deepClone = function (src) {
    if (src instanceof Array) {
        return exports.deepCopy(src, []);
    } else if (src instanceof Object) {
        return exports.deepCopy(src, {});
    } else {
        return src;
    }
};

/* オブジェクトの中身を文字列にする。プロトタイプは無視する。console.logがprintするような内容を返す。 */
exports.reflectToString = function (obj) {
    //TODO array 対応

    var isObject = (obj instanceof Object);
    if (!isObject) {
        return obj.toString();
    }
    var str = '{';
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        var property = obj[key];
        str += key;
        str += ':';
        if (exports.isFunction(property)) {
            str += property.toString();
        } else if (exports.isString(property)) {
            str += '"' + property.toString() + '"';
        } else if (property instanceof Object) {
            str += exports.reflectToString(property);
        } else {
            str += property.toString();
        }
        str += ',';
    }
    str = str.replace(/,$/, '');
    str += '}';
    return str;
};

/* 文字列かどうかの判定 */
exports.isString = function (obj) {
    return typeof obj === 'string';
};

/* functionかどうかの判定 */
exports.isFunction = function (obj) {
    return typeof obj === 'function';
};

/* プロパティ名の正規表現で値を取得する。複数マッチするので配列で返す */
exports.getByRegex = function(obj, regex){
    var result = [];
    for(var key in obj){
        if(!obj.hasOwnProperty(key)) continue;
        if(key.match(regex)){
            var val = obj[key];
            result.push(val);
        }
    }
    return result;
};

