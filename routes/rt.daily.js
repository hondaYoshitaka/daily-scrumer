/*
 * 日々見る画面
 */


exports.index = function(req, res){
    var sprint = require('../test/mock')['Sprint'].sprint01;//TODO
    res.render('daily.index.jade', {
        sprint:sprint
    });
};

