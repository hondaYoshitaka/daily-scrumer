/*
 * test of mdl.event.js
 */
var db = require('../../db'),
    should = require('should'),
    Event = db.models['Event'];

describe('mdl.event.js', function () {
    before(function (done) {
        new Event({
            team_id:'001'
        }).save(function(){
               done();
            });
    });
    before(function (done) {
        new Event({
            team_id:'001'
        }).save(function(){
                done();
            });
    });
    after(function (done) {
        Event.prototype.connector.remove(function () {
            done();
        });
    });

    it('findByTeamId', function(done){
        Event.findByTeamId('001', function(data){
            should.exist(data);
            data.should.be.lengthOf(2);
            done();
        });
    });
});