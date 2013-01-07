/*
 * rt.think_back.jsのテスト
 */

var should = require('should'),
    mock = require('../mock'),
    Req = mock['Req'],
    Res = mock['Res'],

    route = require('../../routes/rt.think_back.js');

describe('rt.think_back', function () {
    require('../check_env.js')();

    it('index', function (done) {
        route.index(new Req({

        }), new Res({
            render:function (view) {
                view.should.equal('think_back/index.jade');
                done();
            }
        }));
    })
});