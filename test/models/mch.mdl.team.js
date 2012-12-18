/*
 * mdl.team.jsのテスト
*/
var should = require('should'),
    db = require('../../db'),
    Team = db.models['Team'],
    Member = Team.Member;

describe('mdl.team', function(){
    before(function(done){

        done();
    });
    after(function(done){
       Team.prototype.connector.remove(done);
    });

    it('addMember', function(done){
        var team = new Team({});
        team.addMember(new Member({
            name:'test.member01'
        }), function(){
            team.members.length.should.equal(1);
            done();
        });
    });
});