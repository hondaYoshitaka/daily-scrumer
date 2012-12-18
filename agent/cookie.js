/*
 * クッキー情報を保持するオブジェクト
 */

var util = require('../util');

exports = module.exports = (function () {

    /* set-cookieヘッダの一行分の情報 */
    var Phrase = function (string) {
        var s = this;
        string.split(';').forEach(function (keyVal) {
            keyVal = keyVal.split('=');
            var key = keyVal[0].replace(/\s/, '');
            s[key] = keyVal[1];
        });
    };

    var Cookie = function (data) {
        var s = this;
        s.set(data);
    };

    /* set-cookieヘッダの情報をセットする */
    Cookie.prototype.set = function (header) {
        var s = this, phrases = [];
        header && header.forEach(function (data) {
            var phrase = new Phrase(data);
            phrases.push(phrase);
        });
        phrases.forEach(function (phrase) {
            var domain = phrase['domain'],
                path = phrase.path;
            if (!s[domain]) s[domain] = {};
            if (!s[domain][path]) s[domain][path] = {};
            util.obj.deepCopy(phrase, s[domain][path]);
        });
        return s;
    };

    /* ドメインに一致するCookie情報を取得する */
    Cookie.prototype.getByDomain = function (domainString) {
        var s = this,
            result = [];
        if(!domainString) return result;
        var domain = domainString.split(/\./).reverse();
        Object.keys(s).forEach(function (key) {
            var match = true,
                keySplit = key.split(/\./);
            domain.forEach(function (domain) {
                var pop = keySplit.pop();
                match = match && (!pop || pop === domain);
            });
            if (match) {
                result.push(s[key]);
            }
        });
        return result;
    };

    /* ドメインとパスからCookie情報を取得する */
    Cookie.prototype.get = function (domain, path) {
        var s = this, result = [];
        s.getByDomain(domain).forEach(function (data) {
            Object.keys(data).forEach(function (key) {
                var match = ('' + path).substr(0, key.length) === key;
                if (match) {
                    result.push(data[key]);
                }
            });
        });
        return result;
    };

    /* ヘッダー用の文字列を取得する */
    Cookie.prototype.getHeaderString = function (domain, path) {
        var s = this,
            str = '';
        s.get(domain, path).forEach(function (data) {
            Object.keys(data).forEach(function (key) {
                switch(key){
                    case 'domain':
                    case 'path':
                        return;
                }
                if(str) str += " ";
                str += [key, data[key]].join('=');
                str += ";"
            });
        });
        return str;
    };
    return Cookie;
})();