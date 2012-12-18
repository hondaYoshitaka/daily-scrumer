/*
 * util.dateのテスト
 */

var util = require('../../util/utl.date.js'),
    should = require('should');

describe('utl.date', function(){

    it('getNow', function(){
        util.getNow().getDate().should.equal(new Date().getDate());
    });

    it('truncateSeconds', function(){
        var date = new Date('Sat Nov 17 2012 10:39:11 GMT+0900 (JST)');
        util.truncateSeconds(date).getSeconds().should.equal(0);
        util.truncateSeconds(date).getMinutes().should.equal(39);
    });

    it('truncateMinutes', function(){
        var date = new Date('Sat Nov 17 2012 10:39:11 GMT+0900 (JST)');
        util.truncateMinutes(date).getSeconds().should.equal(0);
        util.truncateMinutes(date).getMinutes().should.equal(0);
        util.truncateMinutes(date).getHours().should.equal(10);
    });

    it('truncateHours', function(){
        var date = new Date('Sat Nov 17 2012 10:39:11 GMT+0900 (JST)');
        util.truncateHours(date).getSeconds().should.equal(0);
        util.truncateHours(date).getMinutes().should.equal(0);
        util.truncateHours(date).getHours().should.equal(0);
        util.truncateHours(date).getDate().should.equal(17);
    });

    it('between', function(){
        var date = [
            new Date('Sat Nov 17 2012 10:39:11 GMT+0900 (JST)'),
            new Date('Sat Nov 27 2012 10:39:11 GMT+0900 (JST)'),
            new Date('Sat Nov 25 2012 10:39:11 GMT+0900 (JST)')
        ];
        util.between(date[0], date[1]).should.equal(1000 * 60 * 60 * 24 * 10);
        util.between(date[1], date[2]).should.equal(1000 * 60 * 60 * 24 * -2);
        util.between.days(date[0], date[1]).should.equal(10);
        util.between.days(date[1], date[2]).should.equal(-2);

    });

    it('UTC', function(){
        var date = new Date('Sat Nov 17 2012 10:39:11 GMT+0900 (JST)');
        util.UTC(date).should.equal(1353150000000);
        util.UTC.truncateHours(date).should.equal(1353110400000);
    });
});