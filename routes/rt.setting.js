var db = require('../db'),
    Team = db.models['Team'];


exports.index = function (req, res) {
    Team.findAll(function(teams){
        res.render('setting.index.jade', {
            teams:teams
        });
    });
};
