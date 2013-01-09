/*
 * test of rt.story.js
 */

var should = require('should'),
    mock = require('../mock'),
    Req = mock['Req'],
    Res = mock['Res'],
    route = require('../../routes/rt.story.js'),
    db = require('../../db'),
    Sprint = db.models['Sprint'];


describe('rt.story.js', function () {

    require('../check_env.js')();
    before(function (done) {
        new Sprint({
            team_name:'team01'
        }).save(function () {
                done();
            });
    });
    after(function (done) {
        Sprint.prototype.connector.remove(function () {
            done();
        });
    });


    it('story (no team)', function (done) {
        route.index(new Req({

        }), new Res({
            redirect:function (path) {
                path.should.equal('/');
                done();
            }
        }));
    });
    it('story', function (done) {
        route.index(new Req({

        }), new Res({
            locals:{
                team:{
                    name:'team01'
                }
            },
            render:function (view, vars) {
                view.should.equal('story/index.jade');
                vars.sprint.should.have.property('team_name', 'team01');
                done();
            }
        }));
    });
});