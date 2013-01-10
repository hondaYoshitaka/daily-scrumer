/*
 * test of lgc.alert_line.js
 */
var should = require('should'),
    logic = require('../../logic')['alert_line'],
    db = require('../../db'),
    Sprint = db.models['Sprint'],
    Calendar = db.models['Calendar'];


describe('lgc.alert_line.js', function () {

    it('passedDays', function (done) {
        var today = new Date('2013/01/14')
        var sprint = new Sprint({
            begin:"2013/01/4",
            end:'2013/01/24'
        });
        var calendar = new Calendar({
            "holidays":{
                "2013-01-10T15:00:00.000Z":true
            }
        });
        var passedDays = logic.passedDays(today, sprint, calendar);
        passedDays.should.equal(5);
        done();

    });



    it('remainDays', function (done) {
        var today = new Date('2013/01/14')
        var sprint = new Sprint({
            begin:"2013/01/4",
            end:'2013/01/24'
        });

        var calendar = new Calendar({
            "holidays":{
                "2013-01-15T15:00:00.000Z":true
            }
        });
        var remainDays = logic.remainDays(today, sprint, calendar);
        remainDays.should.equal(8);
        done();
    });


    it('totalDays', function (done) {
        var sprint = new Sprint({
            begin:"2013/01/4",
            end:'2013/01/24'
        });
        var calendar = new Calendar({
            "holidays":{
                "2013-01-15T15:00:00.000Z":true
            }
        });
        var totalDays = logic.totalDays(sprint, calendar);
        totalDays.should.equal(14);
        done();
    });


    it('assumeLeftOpenTask (will finish)', function (done) {
        var today = new Date('2013/01/14')
        var sprint = new Sprint({
            begin:"2013/01/4",
            end:'2013/01/24'
        });
        var calendar = new Calendar({
            "holidays":{
                "2013-01-15T15:00:00.000Z":true
            }
        });
        var rate = logic.assumeLeftOpenTask(0.6, today, sprint, calendar);
        rate.should.equal(0);
        done();
    });

    it('assumeLeftOpenTask (will left)', function (done) {
        var today = new Date('2013/01/14')
        var sprint = new Sprint({
            begin:"2013/01/4",
            end:'2013/01/24'
        });
        var calendar = new Calendar({
            "holidays":{
                "2013-01-15T00:00:00.000Z":true
            }
        });
        var rate = logic.assumeLeftOpenTask(0.25, today, sprint, calendar);
        rate.should.equal(0.38);
        done();
    });

    it('assumeLeftOpenTask (will left 2)', function (done) {
        var today = new Date('2013/01/14')
        var sprint = new Sprint({
            begin:"2013/01/4",
            end:'2013/01/20'
        });
        var calendar = new Calendar({
            "holidays":{
                "2013-01-15T15:00:00.000Z":true
            }
        });
        var rate = logic.assumeLeftOpenTask(0.25, today, sprint, calendar);
        rate.should.equal(0.58);
        done();
    });

    it('assumeLeftOpenTask (start day)', function (done) {
        var today = new Date('2013/01/4')
        var sprint = new Sprint({
            begin:"2013/01/4",
            end:'2013/01/24'
        });
        var calendar = new Calendar({
            "holidays":{
                "2013-01-15T15:00:00.000Z":true
            }
        });
        var rate = logic.assumeLeftOpenTask(0.25, today, sprint, calendar);
        rate.should.equal(0);
        done();
    });
});