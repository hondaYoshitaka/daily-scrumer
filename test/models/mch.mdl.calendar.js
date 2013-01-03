/*
 * test of mdl.event.js
 */
var db = require('../../db'),
    should = require('should'),
    Calendar = db.models['Calendar'],
    Event = Calendar.Event;

describe('mdl.calendar.js', function () {
    before(function (done) {
        new Calendar({
            team_name:'001'
        }).save(function(){
               done();
            });
    });
    before(function (done) {
        new Calendar({
            team_name:'002'
        }).save(function(){
                done();
            });
    });
    after(function (done) {
        Calendar.prototype.connector.remove(function () {
            done();
        });
    });


    it('findByTeamName', function(done){
        Calendar.findByTeamName('001', function(data){
            console.log('findByTeamName callback')
            should.exist(data);
            data.should.have.property('team_name', '001');
            done();
        });
    });

    it('addHoliday', function(done){
        var calendar1 = new Calendar();
        calendar1.addHoliday(new Date('2012/12/12'));
        var calendar2 = new Calendar();

        Object.keys(calendar1.holidays).should.be.lengthOf(1);
        Object.keys(calendar2.holidays).should.be.lengthOf(0);
        done();
    });

    it('isHoliday', function(done){
        var calendar1 = new Calendar();
        calendar1.addHoliday(new Date('2012/12/12'));
        calendar1.isHoliday(new Date('2012/12/11')).should.be.false;
        calendar1.isHoliday(new Date('2012/12/12')).should.be.true;
        calendar1.isHoliday(new Date('2012/12/13')).should.be.false;
        done();
    });

    it('removeHoliday', function(done){
        var calendar1 = new Calendar();
        calendar1.addHoliday(new Date('2012/12/12'));
        Object.keys(calendar1.holidays).should.be.lengthOf(1);
        calendar1.removeHoliday(new Date('2012/12/12'));
        Object.keys(calendar1.holidays).should.be.lengthOf(0);
        done();
    });
});