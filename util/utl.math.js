/*
 * 数学に関するUtil
 */


/* ランダムな整数を返す */
exports.randomInt = function(max){
    if(!max) max = 100;
    return (Math.random() * max)&-1;
};

/* ランダムにtrueかfalseを返す */
exports.randomBool = function(){
    return Math.random() > Math.random();
};

/* 合計を求める */
exports.sum = function(numbers){
    var sum = 0;
    numbers.forEach(function(number){
        sum += number
    });
    return sum;
};
/* 平均を求める */
exports.average = function(numbers){
    return exports.sum(numbers) / numbers.length;
};

/* 分散を求める */
exports.variance = function(numbers){
    var average = exports.average(numbers);
    var diffPow = [];
    numbers.forEach(function(number){
        var diff = number - average;
        var pow = Math.pow(diff, 2);
        diffPow.push(pow);
    });
    return exports.average(diffPow);
};

/* 標準を求める */
exports.standardDeviation = function(numbers){
    var variance = exports.variance(numbers);
    return Math.sqrt(variance);
};