/* stringに関するutil */


/* 頭文字を小文字にする。*/
exports.toLowerInitial = function(str){
    if(!str) return str;
    return str.substr(0, 1).toLowerCase() + str.substr(1);
};

/* 頭文字を大文字にする。*/
exports.toUpperInitial = function(str){
    if(!str) return str;
    return str.substr(0, 1).toUpperCase() + str.substr(1);
};

/* キャメルをアンダースコア繋がりに変換する */
exports.camel2Underscore = function(str){
    return str.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();})
        .replace(/^_/,'');
};


/* アンダースコア繋がりをキャメルにする　*/
exports.underscore2Camel = function(str){
    return str.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
};

/* 正規表現をエスケープする */
exports.escapeRegex = function(str){
    return str && str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") || '';
};