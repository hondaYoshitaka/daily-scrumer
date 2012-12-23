/*
 *   https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0CDEQFjAA&url=https%3A%2F%2Fgithub.com%2Fgett%2Fmongojs&ei=VkHDUPvXLcifmQWFy4DIDQ&usg=AFQjCNGHBVSLQWlTak-wwCuGy679T7vcKA&sig2=GW1bCBkjjRKayKmdJHTyKQ&cad=rja
 */
var packageName = require('../package.json')["name"],
    models = require('./models'),
    util = require('../util');

window = undefined;//window called in inflection.js
require('./inflection.js');


const url = (function () {
    var dbName = "";
    //アプリケーション名をそのままDB名にする。
    if (process.env.NODE_ENV == 'test') {
        dbName = 'localhost/' + packageName + '_test';
    }
    else {
        dbName = 'localhost/' + packageName;


    }
    return dbName;
})();


var collections = (function () {
    //コレクション名はそれぞれのモデルが持っている。
    var result = [];
    for (var name in models) {
        if (!models.hasOwnProperty(name)) continue;
        if (name === 'Prototype') continue;
        //collectionNameがあればそれを、無ければmodel名を複数形にしてコレクション化する。
        var model = models[name];
        if (!model.prototype.collectionName) {
            //モデルのオブジェクト名はキャメルでexportされるが、mongoのcollection名はアンスコつながりになる。
            model.prototype.collectionName =
                util.string.toLowerInitial(util.string.camel2Underscore(name.pluralize()));
        }
        result.push(model.prototype.collectionName);
    }
    return result;
})();

var db = exports = module.exports =
    require('mongojs').connect(url, collections);
db.models = models;

exports.url = url;
exports.collections = collections;

console.log('DB connected.', url, collections);

(function () {
    // 実際のDBアクセスはそれぞれのモデル内で行うので、コネクタを事前に渡しておく。
    for (var name in models) {
        if (!models.hasOwnProperty(name)) continue;
        var model = models[name],
            collectionName = model.prototype.collectionName;
        model.prototype.connector = db[collectionName];
    }
})();

