/*
 * チーム情報
 */

var db = require('../db'),
    Team = db.models['Team'];


/* チーム情報取得 */
exports.get = function(req, res){
    var data = req.body;
    //TODO
    var team = new Team({
        name:'mock.team.01',
        members:[
            {name:'mock.member01'},
            {name:'mock.member02'}
        ]
    });
    res.json(team);
};

/* チーム情報の保存 */
exports.save = function(req, res){
    var data = req.body;
    var team = new Team(data);
    team.save(function(){
        res.json({
            success:true
        });
    });
};

/* メンバー追加 */
exports.addMember = function(req, res){
    var data = req.body;
    Team.findById(data._id, function(team){
        //TODO
        res.json({
           success:true
        });
    });
};

/* メンバー情報の更新 */
exports.updateMember = function(req, res){
    var data = req.body;
};

/* メンバー削除 */
exports.removeMember = function(req, res){
    var data = req.body;
    Team.findById(data._id, function(team){
        //TODO
        res.json({
            success:true
        });
    });
};