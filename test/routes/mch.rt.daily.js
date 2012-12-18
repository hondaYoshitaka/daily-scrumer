/*
 * rt.daily.jsのテスト
 */

var should = require('should'),
    mock = require('../mock'),
    Req = mock['Req'],
    Res = mock['Res'],
    route = require('../../routes/rt.daily.js');

describe('rt.daily.js', function(){

    require('../check_env.js')();

    it('daily', function(done){
       route.index(new Req({

       }), new Res({
           render:function(view){
               view.should.equal('daily.index.jade');
               done();
           }
       }))
    });

});