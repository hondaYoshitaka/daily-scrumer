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

exports.remainDays = function (today, sprint, calendar) {
    return countDays(today, new Date(sprint.end), calendar);
};
exports.totalDays = function (sprint, calendar) {
    return countDays(new Date(sprint.begin), new Date(sprint.end), calendar);
};