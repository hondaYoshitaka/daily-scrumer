/*
 * agn.prototype.jsのテスト
 */

var Agent = require('../../agent/agn.prototype.js'),
    should = require('should'),
    Query = Agent.Query,
    Cookie = Agent.Cookie;

describe('agn.prototype', function () {
    describe('Cookie', function () {
        it('set', function (done) {
            var cookie = new Cookie();
            cookie.set([
                'CookieOFF=; expires=Fri, 14-Dec-2012 23:51:38 GMT; domain=.kabu.co.jp; path=/',
                'KUID=%7B26708626%2D6765%2D45D1%2DB521%2D455BE0A84E11%7D; domain=.kabu.co.jp; path=/'
            ]);
            cookie.should.have.property('.kabu.co.jp');
            cookie['.kabu.co.jp'].should.have.property('/');
            cookie['.kabu.co.jp']['/'].should.have.property('KUID', '%7B26708626%2D6765%2D45D1%2DB521%2D455BE0A84E11%7D');

            cookie.set([
                'KUID=234; domain=.kabu.co.jp; path=/'
            ]);
            cookie['.kabu.co.jp']['/'].should.have.property('KUID', "234");
            done();
        });

        it('getByDomain', function (done) {
            var cookie = new Cookie([
                "key0=; key1=val1; domain=.example.com; path=/path1/path2",
                "key0=; key1=val1; domain=mail.example.com; path=/path1/path2"
            ]);
            cookie.getByDomain('.no-match.com').length.should.equal(0);
            cookie.getByDomain('.example.com').length.should.equal(1);
            cookie.getByDomain('mail.example.com').length.should.equal(2);
            cookie.getByDomain('www.example.com').length.should.equal(1);

            done();
        });

        it('get', function (done) {
            var cookie = new Cookie([
                "key0=; key1=val1; domain=.example.com; path=/path1/",
                "key0=; key1=val1; domain=.example.com; path=/path1/path2",
                "key0=; key1=val1; domain=.example.com; path=/path1/path2/path3"
            ]);
            cookie.get('example.com').length.should.equal(0);
            cookie.get('example.com', '/').length.should.equal(0);
            cookie.get('example.com', '/path1/').length.should.equal(1);
            cookie.get('example.com', '/path1/path2/path3/path4/').length.should.equal(3);
            cookie.get('example.com', '/no-match').length.should.equal(0);
            done();
        });


        it('getHeaderString', function (done) {
            var cookie = new Cookie([
                "key0=; key1=val1; domain=.example.com; path=/path1/",
                "key2=; key3=val3; domain=.example.com; path=/path1/path2",
                "key4=; key5=val5; domain=.example.com; path=/path1/path2/path3"
            ]);
            cookie.getHeaderString("example.com", "/").should.equal('');
            cookie.getHeaderString("example.com", "/path1/path2/path3").should.equal(
                "key0=; key1=val1; key2=; key3=val3; key4=; key5=val5;"
            );
            done();
        });
    });
    describe('Query', function () {
        it('toQueryString', function (done) {
            var query = new Query({
                key1:"val1",
                key2:"val2"
            });
            query.toQueryString().should.equal('key1=val1&key2=val2');
            done();
        });
    })
});