/*
 * mdl.sprint.jsのテスト
 */
var should = require('should'),
    db = require('../../db'),
    Sprint = db.models['Sprint'];


describe('mdl.sprint', function(){
    require('../check_env.js')();

    before(function(done){

        done();
    });
    after(function(done){
        Sprint.prototype.connector.remove(done);
    });

});