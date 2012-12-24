/*
 * バリデーション定義。
 * revalidator.schema.jsを生み出す。
 * 文法は https://github.com/flatiron/revalidator　を参考。
 */

(function(isServer){
    var schema = {
        // クライアントサイドでは$.fn.validationFormにここのキー名を渡しておけば,
        // submit時に勝手に実行してエラー表示までやってくれる。
        // 文字列内の'#{}'部分はmsg.jsから適宜置換される。
        login:{
            username:{
                label:'ユーザ名',
                required:true,
                minLength:2
            },
            password:{
                label:'パスワード',
                required:true,
                minLength:2
            }
        }
    };
    if(isServer){
        exports = module.exports = schema;
    } else {
        window.json.validate.schema = schema;
    }
})(typeof(window) === 'undefined');
