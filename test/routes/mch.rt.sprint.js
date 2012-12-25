/*
 * rt.project.jsのテスト
 */

var should = require('should'),
    route = require('../../routes/rt.sprint.js'),
    mock = require('../mock'),
    Req = mock['Req'],
    Res = mock['Res'],
    db = require('../../db'),
    Sprint = db.models['Sprint'];


describe('rt.project', function () {

    require('../check_env.js')();

    before(function (done) {
        new Sprint({
            name:'test.sprint01'
        }).save(function () {
                done();
            });
    });

    after(function (done) {
        Sprint.prototype.connector.remove(function () {
            done();
        });
    });

    it('new', function (done) {
        done();
    });

    it('update', function (done) {
        done();

    });

    it('remove', function (done) {

        done();
    });
});