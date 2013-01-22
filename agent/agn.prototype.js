/*
 * HTTPエージェンンとの雛形
 */

var util = require('../util'),
    request = require('request'),
    cheerio = require('cheerio'),
    urlParser = require('url');

(function (form) {
    request.prototype.form = function () {
        var s = this;
        var result = form.apply(s, arguments);
        console.log('s.body', s.body.length, s.body);
        return result;
    };
})(request.prototype.form);

var Agent = exports = module.exports = function () {
};
var Cookie = exports.Cookie = require('./cookie');
var Query = exports.Query = require('./query');

//Agent.Iconv = require('iconv').Iconv;
Agent.prototype.request = function (method, url, callback, headers) {
    var s = this;

    if (typeof url === 'string') {
        url = urlParser.parse(url);
    }
    var cookie = s.cookie.getHeaderString(url.hostname, url.pathname);
    var r = request({
        method:method,
        url:url.href,
        encoding:null,
        headers:util.obj.deepCopy(headers, {
            "Cookie":cookie || ''
        })
    }, function (err, res, body) {
        if (err) {
            console.error(err);
            return;
        }

        console.log('res.statusCode', res.statusCode);
        var header = res.headers;
        s.cookie.set(header['set-cookie']);


        var body = res.body
        if (s.converter) {
            body = s.converter.convert(body);
        }
        else {
            body = body && body.toString();
        }

        var $ = body ? cheerio.load(body) : null;
        callback && callback.call(s, res, body, $);
    });
    (function (form) {
        r.__proto__.form = function () {
            var s = this;
            var result = form.apply(s, arguments);
            s.headers['content-length'] = s.body.length;
            return result;
        }
    })(r.__proto__.form);
    return r;
};
Agent.prototype.post = function (url, callback) {
    var s = this;
    return s.request('POST', url, callback);
};
Agent.prototype.get = function (url, callback) {
    var s = this;
    return s.request('GET', url, callback);
};
