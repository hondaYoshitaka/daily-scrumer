/*
 * mdl.team.jsのテスト
 */
var should = require('should'),
    db = require('../../db'),
    Team = db.models['Team'],
    Member = Team.Member;

describe('mdl.team', function () {

    require('../check_env.js')();

    before(function (done) {
        new Team({
            name:'team01'
        }).save(function () {
                done();

            });
    });
    after(function (done) {
        Team.prototype.connector.remove(done);
    });

    it('findByName (found)', function(done){
        Team.findByName('team01', function(data){
            should.exist(data);
            data.should.have.property('name', 'team01');
            done();
        });
    });
    it('findByName (not found)', function(done){
        Team.findByName('no_exist_name', function(data){
            should.not.exist(data);
            done();
        });
    });

    it('addMember', function (done) {
        var team = new Team({});
        team.addMember(new Member({
            name:'test.member01'
        }), function () {
            team.members.length.should.equal(1);
            done();
        });
    });

    it('isValid (valid)', function(done){
        var team = new Team({
            name:'some name'
        });
        team.members.push(
            new Member({
                name:'some one'
            })
        );
        team.isValid().should.be.true;
        done();
    });
    it('isValid (invalid)', function(done){
        var team = new Team({
            name:''
        });
        team.members.push(
            new Member({
                name:''
            })
        );
        team.isValid().should.be.false;
        done();
    });
});