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
    Calendar.findByCondition(req.query, function (data) {
        res.json(data);
    });
};

exports.add_holiday = function (req, res) {
    var body = req.body,
        team_name = body.team_name;
    if (!team_name || !body.date) {
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
    if (!team_name) {
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
