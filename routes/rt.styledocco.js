var http = require('http'),
    db = require('../db'),
    Rule = db.models['Rule'];



exports.load = function(req, res){

    var body = req.body;
    Rule.findById(body.rule_id, function (rule) {
        var urls = rule.style_urls || [];
        urls.forEach(function(url){
            console.log('url', url);
        });
    });
};