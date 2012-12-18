/*
 * 市場の価格変化をランダムに生成する
 */

var PriceSeries = exports = module.exports = function () {
};

(function(field){
    Object.keys(field).forEach(function(key){
        var valueKey = "_" + key;
        PriceSeries.prototype[valueKey] = field[key];
        PriceSeries.prototype[key] = function(val){
            var s = this;
            if(!arguments.length) return s[valueKey];
            s[valueKey] = val;
            return s;
        }
    });
})({
    startPrice: 10000,
    maxMove:1000
});


/* 価格の配列を返す */
PriceSeries.prototype.toDataArray = function(length){
    if(!length) length = 100;
    var s = this,
        price = s.startPrice(),
        maxMove = s.maxMove(),
        result = [];
    for(var i=0; i<length; i++){
        var move = parseInt((0.5 - Math.random()) * Math.random() * 2 * maxMove, 10);
        result.push(price + move);
        price += move;
    }
    return result;
};