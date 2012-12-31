/*
 * チーム情報
 */

var util = require('../../util'),
    Model = require('./mdl.prototype.js');

var Team = exports = module.exports = function(data){
    var s = this;
    util.obj.deepCopy(s.defaultValue, s);
    util.obj.deepCopy(data, s);
    if(!s.members) s.members = [];
    if(!s.redmine_projects) s.redmine_projects = [];
    if(!s.issue_statuses) s.issue_statuses = {};
    if(!s.trackers) s.trackers = {};
};

Team.prototype.defaultvalue = {
    /* チーム名 */
    name:null,
    /* メンバー */
    members:[],
    /* project identifier of redmine */
    redmine_projects:[],

    /* issue status settings */
    issue_statuses:{

    }
};
(function(Prototype){
    Team.prototype = new Prototype();
    for(var name in Prototype){
        if (!Prototype.hasOwnProperty(name)) continue;
        Team[name] = Prototype[name];
    }
})(Model);

/* 名称による検索 */
Team.findByName = function(name, callback){
    var s = this;
    return s.findByCondition({
        name:name
    }, function(data){
        callback.call(s, data && data.length && data[0] || null);
    });
};

Team.prototype.getBugTrackerIds = function(){
    var s = this,
        result = [];
    for(var id in s.trackers){
        if(!s.trackers.hasOwnProperty(id)) continue;
        var tracker = s.trackers[id];
        var isBug = tracker.report_as === 'bug';
        if(isBug){
            result.push(id);
        }
    }
    return result;
};
Team.prototype.getTaskTrackerIds = function(){
    var s = this,
        result = [];
    for(var id in s.trackers){
        if(!s.trackers.hasOwnProperty(id)) continue;
        var tracker = s.trackers[id];
        var isBug = tracker.report_as == 'task';
        if(isBug){
            result.push(id);
        }
    }
    return result;
};

var Member = exports.Member = function(data){
    var s = this;
    util.obj.deepCopy(s.defaultValue, s);
    util.obj.deepCopy(data, s);
};
Member.prototype.defaultValue = {
    /* メンバ名 */
    name:null
};

/* メンバーを追加する */
Team.prototype.addMember = function(member, callback){
    var s = this;
    s.members.push(member);
    s.update(callback);
};


/* 有効かどうか */
Team.prototype.isValid = function(){
    var s = this;
    return !!(s.name && s.name.match(/^[a-zA-Z0-9_]*$/));
};



Team.IssueStatus = function(data){
    var s = this;
    util.obj.deepCopy(Team.IssueStatus.defaultValue, s);
    util.obj.deepCopy(data, s);
};
Team.IssueStatus.defaultValue = {
    id:null,
    name:null,
    report_as:null
};

Team.Tracker = function(data){
    var s = this;
    util.obj.deepCopy(Team.Tracker.defaultValue, s);
    util.obj.deepCopy(data, s);
};
Team.Tracker.defaultValue = {
    id:null,
    name:null,
    as_task:false
};