var ObjectId = require('mongojs').ObjectId;

var Model = exports = module.exports = function(){};

/* mongo 上のコレクション名。各モデル内で定義すること。 */
Model.prototype.collectionName = null;

/* collectionNameに応じて割り振られる。*/
Model.prototype.connector = null;

/* インスタンスにデフォルトとして与えられる値。*/
Model.prototype.defaultValue = null;

/* エラーハンドラを設定する */
Model.prototype.setErrHandler = function(handler){
    var s = this;
    s.errHandler = handler;
    return s;
};
/* エラーハンドラを呼ぶ */
Model.prototype.raiseErr = function(err){
    var s = this;
    if(typeof err === 'string'){
        err = new Error(err);
    }
    s.errHandler && s.errHandler.call(s, err);
    return s;
};



/* IDでの検索 */
Model.findById = function(id, callback){
    if(typeof(id) === 'string') id = new ObjectId(id);
    return this.findByCondition({_id:id}, function(data){
        callback && callback.call(this, data.length && data[0]);
    });
};

/* 全件取得。数が多い場合合はiterateを使いましょう。 */
Model.findAll = function(callback){
    return this.findByCondition({}, callback);
};
/* 条件付き検索 */
Model.findByCondition = function(condition, callback){
    var s = this;
    return s.prototype.connector.find(condition, function(err, data){
        var result = [];
        if(err){
            console.error('[DB err]', err);
            callback && callback.call(s, result);
            return;
        }
        data && data.forEach(function(data){
            var entity = new s(data);
            entity._id = data._id.toString();
            result.push(entity);
        });
        callback && callback.call(s, result);
    });
};

/* 条件付き検索で一件目だけ持ってくる */
Model.findOneByCondition = function(condition, callback){
    var s = this;
    return s.findByCondition(condition, function(result){
        callback && callback.call(s, result.length && result[0] || null);
    });
};

/* 全件逐次取得。callbackに一件ずつ渡される。 */
Model.iterateAll = function(callback){
    return this.iterateByCondition({}, callback);
};

/* 条件付き逐次取得。callbackに一件ずつ渡される。 */
Model.iterateByCondition = function(condition, callback){
    var s = this,
        connector = s.prototype.connector;
    return connector.find(condition).forEach(function(err, data){
        if(err){
            console.error('[DB err]', err);
            callback && callback.call(s, null);
            return;
        }
        if(!data) return;
        callback && callback.call(this, new s(data));
    });
};

/* 全件カウント */
Model.countAll = function(callback){
    var s = this,
        connector = s.prototype.connector;
    return connector.count(function(err, data){
        if(err){
            console.error('[DB err]', err);
            callback && callback.call(s, null);
            return;
        }
        callback.call(s, data);
    });
};

/* 保存 */
Model.prototype.save = function(callback){
    var s = this,
        proto = s.__proto__;
    //prototypeの値でDBを汚さないよう、一旦回避する。
    s.__proto__ = null;
    return proto.connector.save(s, function(err, data){
        if(err) {
            s.raiseErr && s.raiseErr(err);
            console.error(err);
            return;
        }
        s.__proto__ = proto;
        callback && callback.call(this, s);
    })
};

/* 更新 */
Model.prototype.update = function(callback){
    var s = this,
        proto = s.__proto__;
    //prototypeの値でDBを汚さないよう、一旦回避する。
    s.__proto__ = null;
    if(typeof s._id === 'string'){
        s._id = new ObjectId(s._id);
    }
    return proto.connector.update({
        _id:s._id
    }, s, function(err, cnt){
        if(err) if(err) s.raiseErr(err);
        s.__proto__ = proto;
        callback && callback.call(s);
    });
};

/* 削除 */
Model.prototype.remove = function(callback){
    var s = this,
        proto = s.__proto__;
    //prototypeの値でDBを汚さないよう、一旦回避する。
    s.__proto__ = null;
    if(typeof s._id === 'string'){
        s._id = new ObjectId(s._id);
    }
    return proto.connector.remove({
        _id:s._id
    }, s, function(err){
        if(err) s.raiseErr(err);
        s.__proto__ = proto;
        callback && callback.call(s);
    });
};

