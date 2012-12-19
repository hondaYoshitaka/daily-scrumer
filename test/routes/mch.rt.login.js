/*
 * rt.login.jsのテスト
 */

var should = require('should'),
    mock = require('../mock'),
    Req = mock['Req'],
    Res = mock['Res'],

    route = require('../../routes/rt.login.js');

describe('rt.login', function(){

    require('../check_env.js')();

    it('auth', function(done){
        done();
    });

    it('logout', function(done){
        done();
    });
});
