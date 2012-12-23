/*
 * トップ画面
 */

var db = require('../db'),
    Team = db.models['Team'];

/* トップ画面 */
exports.index = function (req, res) {
    Team.findAll(function(teams){
        res.render('index.jade', {
            teams:teams
        });
    });
};
