/*
 * uti.objのテスト
 */

var util = require('../../util/utl.obj.js'),
    should = require('should');

describe('utl.obj', function(){
    it('deepCopy', function (done) {
        util.deepCopy({a:1}, {}).should.have.property('a', 1);
        util.deepCopy({a:{b:2}}, {})['a'].should.have.property('b', 2);

        util.deepCopy({a:[1, 2, 3]}, {})['a'][1].should.equal(2);
        util.deepCopy({a:[
            {b:4}
        ]}, {})['a'][0]['b'].should.equal(4);

        var func = function () {
        };
        util.deepCopy({f:func}, {})['f'].should.equal(func);

        util.deepCopy([1, 2, 3], [4, 5, 6])[0].should.equal(1);
        util.deepCopy([1, 2, 3], [4, 5, 6])[2].should.equal(3);
        done();
    });

    it('deepClone', function (done) {
        util.deepClone({a:1}).should.have.property('a', 1);
        util.deepClone({a:{b:2}})['a'].should.have.property('b', 2);

        util.deepClone({a:[1, 2, 3]})['a'][1].should.equal(2);
        util.deepClone({a:[
            {b:4}
        ]})['a'][0]['b'].should.equal(4);
        var func = function () {
        };
        util.deepClone({f:func})['f'].should.equal(func);

        util.deepClone([1, 2, 3])[2].should.equal(3);
        done();
    });

    it('reflectToString', function (done) {
        util.reflectToString({a:1, b:{c:2}}).should.equal("{a:1,b:{c:2}}");
        util.reflectToString({a:'bcd'}).should.equal('{a:"bcd"}');
        done();
    });

    it('isString', function (done) {
        util.isString('abc').should.be.true;
        util.isString(123).should.be.false;
        util.isString({}).should.be.false;
        util.isString([]).should.be.false;
        util.isString(function () {
        }).should.false;
        done();
    });

    it('isFunction', function (done) {
        util.isFunction('abc').should.be.false;
        util.isFunction(123).should.be.false;
        util.isFunction({}).should.be.false;
        util.isFunction([]).should.be.false;
        util.isFunction(function () {
        }).should.true;
        done();
    });

    it('getByPrefix', function(done){
        var obj = {
            key1:'val1',
            key11:'val11',
            key2:'val2',
            key22:'val22'
        };
        util.getByRegex(obj, /key.*/).length.should.equal(4);
        util.getByRegex(obj, /key1.*/).length.should.equal(2);
        util.getByRegex(obj, /key11/).length.should.equal(1);
        util.getByRegex(obj, /key3/).length.should.equal(0);

        done();
    });

    it('copy', function(done){
        var obj1 = {
            key1:1,
            key2:2
        };
        var obj2 = {
            key1:0,
            key3:3
        };
        util.copy(obj1, obj2);
        obj2.should.have.property('key1', 1);
        obj2.should.have.property('key2', 2);
        obj2.should.have.property('key3', 3);
        done();
    });
});