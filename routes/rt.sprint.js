/*
 * プロジェクト情報
 */

var RedmineAgent = require('../agent')['Redmine'],
    util = require('../util'),
    db = require('../db'),
    Sprint = db.models['Sprint'];

/* 不具合数を取得する */
exports.issue_count = function (req, res) {

    res.json({
        success:true,
        total:80,
        modified:30,
        done:50
    });
};

/* タスク時間の状況を取得する */
exports.task_time = function (req, res) {

    //TODO
    res.json({
        success:true,
        estimated:130,
        remain:80,
        consumed:80
    });
};

/* スプリントを新規作成する */
exports.new = function (req, res) {
    //TODO バリデーション
    var body = req.body;
    var sprint = new Sprint(body);
    sprint.save(function () {
        res.json({
            success:true,
            sprint:sprint
        });
    });
};

/* スプリントを更新する */
exports.update = function (req, res) {
    var body = req.body;
    var sprint = new Sprint(body);
    sprint.update(function () {
        res.json({
            success:true,
            sprint:sprint
        });
    });
};

/* スプリントの心がけを更新する */
exports.update_keep_in_mind = function (req, res) {
    var body = req.body;
    Sprint.findById(body._id, function(sprint){
        if(!sprint){
            res.json({
                success:false
            });
            return;
        }
        sprint.keep_in_mind_0 = body.keep_in_mind_0;
        sprint.keep_in_mind_1 = body.keep_in_mind_1;
        sprint.keep_in_mind_2 = body.keep_in_mind_2;
        sprint.update(function(){
            res.json({
                success:true,
                sprint:sprint
            });
        });
    });
};

/* スプリントを削除する */
exports.remove = function (req, res) {
    var body = req.body;
    Sprint.findById(body._id, function (sprint) {
        sprint.remove(function () {
            res.json({
                success:true
            });
        });
    });
};


