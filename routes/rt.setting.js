var db = require('../db'),
    Sprint = db.models['Sprint'];


exports.index = function (req, res) {
    //TODO teamのスプリントだけを取ってくる
    Sprint.findAll(function(sprints){
        res.render('setting.index.jade', {
            sprints:sprints
        });
    });
};
