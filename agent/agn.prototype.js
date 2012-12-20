/*
 * HTTPエージェンンとの雛形
 */

var util = require('../util'),
    request = require('request'),
    cheerio = require('cheerio'),
    urlParser = require('url');


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
    console.log('[agn]', method, url.href);
    return request({
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
        if(s.converter){
            body = s.converter.convert(body);
        }
        else{
            body = body.toString();
        }

        var $ = cheerio.load(body);
        callback && callback.call(s, res, body, $);
    });
};
Agent.prototype.post = function (url, callback) {
    var s = this;
    return s.request('POST', url, callback);
};
Agent.prototype.get = function (url, callback) {
    var s = this;
    return s.request('GET', url, callback);
};
