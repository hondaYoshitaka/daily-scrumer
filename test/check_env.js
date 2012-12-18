/*
 * envが正しいかどうかの確認
 */

var fs = require('fs'),
    util = require('../util');


exports = module.exports = function () {
    if(!util.env.isTest()){
        console.error('envをテストにしてください。export NODE_ENV=test');
        throw('envが不正です。export NODE_ENV=testを設定してください。');
    }
};