var util = require('../util');

function countDays(begin, end, calendar) {
    var current = new Date(begin);
    var days = 0;

    while (current.getDate() < end.getDate()) {
        var isHoliday =(function(){
            switch (current.getDay()) {
                case 0:
                case 6:
                    return true;
            }
            return calendar.isHoliday(current);
        })();
        current.setDate(current.getDate() + 1);
        if (!isHoliday) days++;
    }
    return days;
}

exports.passedDays = function (today, sprint, calendar) {
    return countDays(new Date(sprint.begin), new Date(today), calendar);
};

exports.remainDays = function (today, sprint, calendar) {
    var endNext = new Date(sprint.end);
    endNext.setDate(endNext.getDate() + 1);
    return countDays(today, endNext, calendar);
};

exports.totalDays = function (sprint, calendar) {
    var endNext = new Date(sprint.end);
    endNext.setDate(endNext.getDate() + 1);
    return countDays(new Date(sprint.begin), endNext, calendar);
};


exports.assumeLeftOpenTask = function (doneRate, today, sprint, calendar) {
    var totalDays = exports.totalDays(sprint, calendar),
        remainDays = exports.remainDays(today, sprint, calendar),
        passedDays = exports.passedDays(today, sprint, calendar);
    if(!passedDays) return 0;
    var velocity = doneRate / passedDays,
        capable = remainDays * velocity;
    var rate = doneRate + capable;
    if(rate>1) return 0;
    return Number((1 - rate).toFixed(2));
};