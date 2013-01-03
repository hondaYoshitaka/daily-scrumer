/*
 * バリデーション定義。
 * 文法は https://github.com/flatiron/revalidator　を参考。
 */

(function(isServer){
    var schema = {
        new_event:{
            title:{
                label:'title',
                required:true
            }
        },
        new_sprint:{
            name:{
                label:'sprint name',
                required:true
            },
            'redmine_versions[]':{
                label:'redmine sprint',
                required:true
            }
        }
    };
    if(isServer){
        exports = module.exports = schema;
    } else {
        window.json.validate.schema = schema;
    }
})(typeof(window) === 'undefined');
