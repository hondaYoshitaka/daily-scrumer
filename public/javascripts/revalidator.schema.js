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
        update_event:{
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
            },
            begin:{
                label:'begin date',
                required:true
            },
            end:{
                label:'end date',
                require:true
            }
        },
        update_sprint_days:{
            _id:{
                label:'_id',
                required:true
            },
            begin:{
                label:'begin date',
                required:true
            },
            end:{
                label:'end date',
                require:true
            }
        },
        new_member:{
            name:{
                label:'member name',
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
