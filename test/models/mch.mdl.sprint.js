/*
 * mdl.sprint.jsのテスト
 */
var should = require('should'),
    db = require('../../db'),
    Sprint = db.models['Sprint'];


describe('mdl.sprint', function () {
    require('../check_env.js')();

    before(function (done) {
        new Sprint({
            team_name:'team_01',
            number:1
        }).save(function () {
                done();

            });
    });
    before(function (done) {
        new Sprint({
            team_name:'team_01',
            number:2
        }).save(function () {
                done();

            });
    });
    after(function (done) {
        Sprint.prototype.connector.remove(done);
    });


    it('findByTeamName', function (done) {
       Sprint.findByTeamName('team_01', function(data){
           should.exist(data);
           data.should.be.lengthOf(2);
           done();
        });
    });

    it('findLatestByTeam', function (done) {
        Sprint.findLatestByTeam('team_01', function(data){
            should.exist(data);
            data.number.should.equal(2);
            done();
        });
    });


});