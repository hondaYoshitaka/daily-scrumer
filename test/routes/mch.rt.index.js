/*
 * mch.rt.index.jsのテスト
 */

var should = require('should'),
    mock = require('../mock'),
    Req = mock['Req'],
    Res = mock['Res'],

    route = require('../../routes/rt.index.js');

describe('mch.rt.index', function(){
    it('index', function(done){
        route.index(new Req({

        }), new Res({
            render:function(view){
                view.should.equal('index.jade');
                done();
            }
        }))

    });
});