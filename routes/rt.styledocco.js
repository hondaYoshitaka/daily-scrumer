var http = require('http'),
    request = require('request'),
    db = require('../db'),
    fs = require('fs'),
    util = require('../util'),
    Rule = db.models['Rule'];


exports.style_dir = [__dirname, '..', 'work/styledocco'].join('/');

function failJson(res){
    res.json({
        success:false
    });
}
exports.load = function(req, res){

    var body = req.body;
    Rule.findById(body.rule_id, function (rule) {
        var urls = rule.style_urls || [];
        var count = urls.length;
        urls.forEach(function(url){
            console.log('url', url);
            request.get(url, function(err, r, body){
                count--;
                var file = [exports.style_dir, url.replace(/\//, /\\\//)].join('');
                fs.writeFile(file, body, function(err){
                    if(err){
                        failJson(res);
                    }
                });
                if(count === 0){
                    res.json({
                        success:true
                    });
                }
            });
        });
    });
};