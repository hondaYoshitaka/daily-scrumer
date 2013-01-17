var db = require('../db'),
    Rule = db.models['Rule'];

function failJson(res) {
    res.json({
        success:false
    });
}
exports.index = function (req, res) {
    var team_name = res.locals.team && res.locals.team.name;
    Rule.findByTeamName(team_name, function (rule) {
        if (rule) {
            res.render('rule/index.jade', {
                rule:rule
            });
        } else {
            rule = new Rule({
                team_name:team_name
            });
            rule.save(function () {
                res.render('rule/index.jade', {
                    rule:rule
                });
            });
        }
    });
};

exports.update = function () {
};

exports.update.style_urls = function (req, res) {
    var body = req.body;
    var isValid = !!(body._id && body.style_urls);
    if (!isValid) {
        failJson(res);
        return;
    }
    Rule.findById(body._id, function (rule) {
        if (!rule) {
            failJson(res);
            return;
        }
        rule.style_urls = body.style_urls;
        rule.update(function () {
            res.json({
                success:true,
                rule:rule
            });
        });
    });

};