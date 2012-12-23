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

    before(function(done){
        new Team({
            name:'team01'
        }).save(function(){
                done();
            });
    });
    after(function(done){
        Team.prototype.connector.remove(function(){
            done();
        });
    });

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
    it('all (change team name', function(done){
        var req = new Req({
            session:{
                team:{
                    name:'old_team'
                }
            },
            params:{
                team:{
                    name:'team01'
                }
            }
        });
        var res = new Res({});
        route.all(req, res, function(){
            req.session.team.should.have.property('name', 'team01');
            done();
        });
    });
});