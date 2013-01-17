var db = require('../db'),
    util = require('../util'),
    Sprint = db.models['Sprint'],
    Story = db.models['Story'],
    Team = db.models['Team'];


exports.index = function (req, res) {
    if (!res.locals.team) {
        res.redirect('/');
        return;
    }
    var team = new Team(res.locals.team);
    Sprint.findByTeamName(team.name, function (sprints) {
        var sprint = (function () {
            if (!sprints.length) return null;
            return sprints.sort(function (a, b) {
                return Number(b.number) - Number(a.number);
            })[0];
        })();
        if (!sprint) {
            res.redirect(['/team', team.name, 'setting'].join('/'));
            return;
        }
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
        redmine_id = body.redmine_id,
        checkpoints = body.checkpoints;
    var valid = !!(redmine_id);
    if (!valid) {
        failJson(res);
        return;
    }
    Story.findByRedmineId(redmine_id, function (story) {
        if (story) {
            story.checkpoints = checkpoints;
            story.update(function () {
                res.json({
                    success:true,
                    story:story
                });
            });
        } else {
            story = new Story(body);
            story.save(function () {
                res.json({
                    success:true,
                    story:story
                });
            });
        }
    });

};