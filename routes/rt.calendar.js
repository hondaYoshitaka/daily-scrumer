/*
 *
 */

var db = require('../db'),
    Calendar = db.models['Calendar'];

function fail(res) {
    res.json({
        success:false
    });
}

exports.index = function (req, res) {
    Calendar.findByTeamName(req.query.team_name, function (data) {
        res.json(data);
    });
};

exports.add_holiday = function (req, res) {
    var body = req.body,
        team_name = body.team_name;
    var valid = team_name && body.date;
    if (!valid) {
        fail(res);
        return;
    }
    Calendar.findByTeamName(team_name, function (calendar) {
        if (!calendar) {
            fail(res);
            return;
        }
        calendar.addHoliday(body.date);
        calendar.update(function () {
            res.json({
                success:true,
                calendar:calendar
            });
        });
    });
};
exports.remove_holiday = function (req, res) {
    var body = req.body,
        team_name = body.team_name;
    var valid = team_name && body.date;
    if (!valid) {
        fail(res);
        return;
    }
    Calendar.findByTeamName(team_name, function (calendar) {
        if (!calendar) {
            fail(res);
            return;
        }
        calendar.removeHoliday(body.date);
        calendar.update(function () {
            res.json({
                success:true,
                calendar:calendar
            });
        });
    });
};
