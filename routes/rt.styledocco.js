var exec = require('child_process')['exec'],
    db = require('../db'),
    fs = require('fs'),
    conf = require('../conf'),
    util = require('../util'),
    urlParser = require('url'),
    Rule = db.models['Rule'];

var Agent = (function(Prototype){
    var Agent = function(data){
        var s = this;
        if (data) {
            util.obj.deepCopy(data, s);
            s.cookie = new Agent.Cookie(data.cookie);
        } else {
            s.cookie = new Agent.Cookie();
        }
    };
    Agent.prototype = new Prototype();
    util.obj.copy(Prototype, Agent);
    return Agent;
})(require('../agent/agn.prototype'));

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
        var count = urls.length, abort = false;
        urls.forEach(function(url){
            new Agent().get(url, function(r, body, $){
                if(abort) return;
                count--;
                var name = urlParser.parse(url).pathname.replace(/\//g, "_");
                var file = [exports.style_dir, name].join('/');
                fs.writeFile(file, body, function(err){
                    if(err){
                        console.error(err)
                        failJson(res);
                        abort = true;
                        return;
                    }
                    if (count === 0) {
                        var command = conf.styledocco.command;
                        exec(command, function(err){
                            if(err){
                                failJson(res);
                                return;
                            }
                            res.json({
                                success:true
                            });
                        });
                    }
                });
            });
        });
    });
};