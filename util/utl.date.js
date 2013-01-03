/*
 * 日付に関するutil
 */

exports.getNow = function () {
    return new Date();
};


/* 秒以下のを切り捨てる */
exports.truncateSeconds = function (date) {
    date.setSeconds(0);
    return date;
};

/* 分以下を切り捨てる */
exports.truncateMinutes = function (date) {
    date = exports.truncateSeconds(date);
    date.setMinutes(0);
    return date;
};

/* 時以下を切り捨てる */
exports.truncateHours = function (date) {
    date = exports.truncateMinutes(date);
    date.setHours(0);
    return date;
};


/* 日付がどれだけは慣れているかをミリ秒で返す */
exports.between = function (date1, date2) {
    return date2 - date1;
};

/* 日付がどれだけは慣れているかを日数で返す */
exports.between.days = function (date1, date2) {
    var between = exports.between(date1, date2) / (1000 * 60 * 60 * 24);
    return parseInt(between, 10);
};


/* January 1, 1970 からの経過時間をミリ秒で返す */
exports.UTC = function (date) {
    date = new Date(date);
    var UTC = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getSeconds(),
        date.getMilliseconds()
    );
    return parseInt(UTC, 10);
};

/* January 1, 1970 からの経過日数をミリ秒で返す */
exports.UTC.truncateHours = function (date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    var day = exports.truncateHours(date);
    return exports.UTC(day);
};


