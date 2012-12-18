/*
 * utl.math.jsのテスト
 */

var should = require('should'),
    util = require('../../util/');

describe('utl.math', function () {
    var math = util['math'];
    it('randomInt', function (done) {
        math.randomInt().should.be.below(101);
        math.randomInt().should.be.above(-1);
        math.randomInt(2).should.be.below(3);
        var r = math.randomInt();
        r.should.be.equal(r & -1);
        done();
    });

    it('randomBool', function (done) {
        should.exist(math.randomBool());
        done();
    });

    it('sum', function (done) {
        math.sum([1, 2, 3, 4, 5]).should.equal(15);
        done();
    });

    it('average', function (done) {
        math.average([1, 2, 3, 4, 5]).should.equal(3);
        done();
    });

    it('variance', function (done) {
        math.variance([1, 2, 3, 4, 5]).should.equal(2);
        done();
    });

    it('standardDeviation', function(done){
        math.standardDeviation([1,2,3,4,5]).should.equal(1.4142135623730951);
        done();
    });
});
