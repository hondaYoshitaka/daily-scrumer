function countDays(begin, end, calendar) {
    var current = new Date(begin);
    var remainDays = 0;
    while (current <= end) {
        current.setDate(current.getDate() + 1);
        switch (current.getDay()) {
            case 0:
            case 1:
                continue;
        }
        var isHoliday = calendar.isHoliday(current);
        if (isHoliday) continue;
        remainDays++;
    }
    return remainDays;
}

exports.passedDays = function (today, sprint, calendar) {
    var yesterday = (function (date) {
        date.setDate(date.getDate() - 1);
        return date;
    })(new Date(today));
    return countDays(new Date(sprint.begin), yesterday, calendar);
};

exports.remainDays = function (today, sprint, calendar) {
    return countDays(today, new Date(sprint.end), calendar);
};

exports.totalDays = function (sprint, calendar) {
    return countDays(new Date(sprint.begin), new Date(sprint.end), calendar);
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