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

    it('all (invalid team name)', function(done){
        route.all(new Req({
            session:{

            },
            params:{
                team:'some_invalid_name'
            }
        }), new Res({
            redirect:function(path){
                path.should.equal('/');
                done();
            }
        }));
    });
});