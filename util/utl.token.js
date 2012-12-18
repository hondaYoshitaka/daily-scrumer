/* tokenの発行など */

var uuid = require('node-uuid');

exports.generate = function(){
    /* token(一意なランダム文字列)を発行する */
    return require('node-uuid').v4().replace(/-/g, '')
};