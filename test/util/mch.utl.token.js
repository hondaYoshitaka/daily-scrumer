/*
 * util.token.jsのテスト
 */

var util = require('../../util/utl.token.js'),
    should = require('should');


describe('utl.token', function () {
    it('generate', function () {
        util.generate().should.not.equal(util.generate());

    });
});

