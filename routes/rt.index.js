/*
 * トップ画面
 */

exports.index = function (req, res) {
    res.render('index.jade', {
        title:'Express'
    });
};
