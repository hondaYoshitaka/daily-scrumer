/*
 * mch.rt.index.jsのテスト
 */

var should = require('should'),
    mock = require('../mock'),
    Req = mock['Req'],
    Res = mock['Res'],
    route = require('../../routes/rt.index.js'),
    db = require('../../db'),
    Team = db.models['Team'];

describe('mch.rt.index', function () {

    require('../check_env.js')();

    before(function(done){
        Team.prototype.connector.remove(function(){
            done();
        });
    });
    before(function (done) {
        new Team({
            name:'team01'
        }).save(function () {
                done();
            });
    });
    before(function(done){
        new Team({
            name:'team02'
        }).save(function(){
                done();
            });
    });
    after(function(done){
        Team.prototype.connector.remove(function(){
            done();
        });
    });

    it('index', function (done) {
        route.index(new Req({

        }), new Res({
            render:function (view, vars) {
                view.should.equal('index.jade');
                should.exist(vars);
                vars.teams.should.have.lengthOf(2);
                vars.teams[0].should.have.property('name', 'team01');
                done();
            }
        }));

    });
});