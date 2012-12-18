/*
 * rt.team.jsのテスト
 */
var should = require('should'),
    mock = require('../mock'),
    Req = mock['Req'],
    Res = mock['Res'],
    db = require('../../db'),
    Team = db.models['Team'],
    route = require('../../routes/rt.team.js');

describe('rt.team', function () {
    require('../check_env.js')();
    it('get', function (done) {
        route.get(new Req({

        }), new Res({
            json:function (team) {
                should.exist(team);
                done();
            }
        }));
    });
    it('addMember', function(){

    });
    it('removeMember', function(){

    });
});