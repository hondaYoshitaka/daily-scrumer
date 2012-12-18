/*
 * util.env.jsのテスト
 */

var util = require('../../util/utl.env.js'),
    should = require('should');

describe('utl.env', function () {

    it('isTest', function (done) {
        util.isTest().should.be.true;
        done();
    });

    it('isDevelopment', function (done) {
        util.isDevelopment().should.be.false;
        done();
    });

    it('isProduction', function (done) {
        util.isProduction().should.be.false;
        done();
    });
});