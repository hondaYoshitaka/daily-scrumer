/*
 *
 */

var db = require('../db'),
    Event = db.models['Event'];

function fail(res) {
    res.json({
        success:false
    });
}
exports.list = function(req, res){
    var query = req.query;
    Event.findByCondition(query, function(data){
        res.json(data);
    });
};
exports.new = function (req, res) {
    var body = req.body;

    var event = new Event(body);

    event.save(function () {
        res.json({
            success:true,
            event:event
        });
    });
};

exports.update = function (req, res) {
    var body = req.body,
        id = body._id;
    if (!id) {
        fail(res);
        return;
    }
    Event.findById(id, function (data) {
        if (!data) {
            fail(res);
            return;
        }
        var event = new Event(body);
        event.update(function () {
            res.json({
                success:true,
                event:event
            });
        });
    });
};

exports.remove = function (req, res) {
    var body = req.body,
        id = body._id;
    if (!id) {
        fail(res);
        return;
    }
    Event.findById(id, function (event) {
        if (!event) {
            fail(res);
            return;
        }
        event.remove(function(){
            res.json({
                success:true
            });
        });
    });
};

