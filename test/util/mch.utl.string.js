/*
 * util.stringのテスト
 */
var util = require('../../util/utl.string.js'),
    should = require('should');


describe('utl.string', function(){
    it('toLowerInitial', function(done){
        util.toLowerInitial("Apple").should.equal('apple');
        util.toLowerInitial("apple").should.equal('apple');
        done();
    });

    it('toUpperInitial', function(done){
        util.toUpperInitial("orange").should.equal('Orange');
        util.toUpperInitial("Orange").should.equal('Orange');
        done();
    });

    it('camel2Underscore', function(done){
        util.camel2Underscore('FineDay').should.equal('fine_day');
        util.camel2Underscore('fineDay').should.equal('fine_day');
        util.camel2Underscore('fine_day').should.equal('fine_day');
        done();
    });

    it('underscore2Camel', function(done){
        util.underscore2Camel('up_up').should.equal('upUp');
        util.underscore2Camel('upUp').should.equal('upUp');
        util.underscore2Camel('UpUp').should.equal('UpUp');
        done();
    });

    it('escapeRegex', function(done){
        util.escapeRegex("http://example.com/").should.equal("http:\/\/example\\\.com\/");
        done();
    });

    it('extractNumber', function(done){
        util.extractNumber("123").should.equal(123);
        util.extractNumber("abc123").should.equal(123);
        util.extractNumber("abc123def").should.equal(123);
        util.extractNumber("123def").should.equal(123);
        should.not.exist(util.extractNumber("abc"));
        should.not.exist(util.extractNumber(""));
        should.not.exist(util.extractNumber(null));
        should.not.exist(util.extractNumber(undefined));

        done();
    });
});