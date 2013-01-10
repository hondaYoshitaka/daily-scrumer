var db = require('../db'),
    util = require('../util'),
    Sprint = db.models['Sprint'],
    Team = db.models['Team'];


exports.index = function (req, res) {
    if (!res.locals.team) {
        res.redirect('/');
        return;
    }
    var team = new Team(res.locals.team);
    Sprint.findLatestByTeam(team.name, function (sprint) {
        res.render('story/index.jade', {
            sprint:sprint,
            trackers:{
                task:team.getTaskTrackerIds(),
                bug:team.getBugTrackerIds()
            }
        });
    });
};

function failJson(res) {
    res.json({
        success:false
    });
}


exports.update = function () {
};

exports.update.checkpoints = function (req, res) {
    var body = req.body,
        id = body._id,
        checkpoints = body.checkpoints;
    var valid = !!(id && checkpoints);
    if (!valid) {
        failJson(res);
        return;
    }
    Sprint.findById(id, function (story) {
        if (!data) {
            failJson(res);
            return;
        }
        story.checkpoints = checkpoints;
        res.json({
            success:true,
            story:story
        });
    });

};