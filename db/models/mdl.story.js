var util = require('../../util'),
    Model = require('./mdl.prototype.js');

var Story = exports = module.exports = function (data) {
    var s = this;
    util.obj.deepCopy(s.defaultValue, s);
    util.obj.deepCopy(data, s);
};
(function(Prototype){
    Story.prototype = new Prototype();
    util.obj.copy(Prototype, Story);
})(Model);

Story.prototype.defaultValue = {
    sprint_id:null,
    redmine_id:null,
    check_points:[]
};

Story.findBySprintId = function(sprint_id, callback){
    var s = this;
    s.findByCondition({
        sprint_id:sprint_id
    }, callback);
}