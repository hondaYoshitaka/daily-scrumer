/*
 * バリデーション定義。
 * revalidator.schema.jsを生み出す。
 * 文法は https://github.com/flatiron/revalidator　を参考。
 */

(function(isServer){
    var schema = {
    };
    if(isServer){
        exports = module.exports = schema;
    } else {
        window.json.validate.schema = schema;
    }
})(typeof(window) === 'undefined');
