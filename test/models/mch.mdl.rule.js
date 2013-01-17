var db = require('../../db'),
    should = require('should'),
    Rule = db.models['Rule'];


describe('mdl.rule', function () {
    require('../check_env')();
    before(function (done) {
        new Rule({
            team_name:'team_01'
        }).save(function () {
                done();
            });
    });
    before(function (done) {
        new Rule({
            team_name:'team_02'
        }).save(function () {
                done();
            });
    });
    after(function (done) {
        Rule.prototype.connector.remove(function () {
            done();
        });
    });
    it('findByTeamName', function (done) {
        Rule.findByTeamName('team_01', function(data){
            data.should.have.property('team_name', 'team_01');
            done();
        });
    });
});