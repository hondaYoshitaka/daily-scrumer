/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , path = require('path')
    , msg = require('./msg')
    , fs = require('fs')
    , logic = require('./logic')
    , util = require('./util')
    , package = require('./package.json');

var app = express();
app.locals({
    app:{
        title:package.name
    },
    msg:msg
});
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(require('less-middleware')({ src:__dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
    (function (precompiler) {
        ['setting', 'daily', 'think_back'].forEach(function (key) {
            var watchDir = [__dirname, "views", key].join('/');
            if (!util.file.exists(watchDir)) return;

            var outFileName = ["handlebars.template", key, "js"].join('.'),
                outFile = [__dirname, "public/javascripts", outFileName].join('/');

            precompiler.do(watchDir, outFile);

        });
    })(util['handlebars_precompile']);
});

(function (r) {
    app.all('*', function (req, res, next) {
        var path = req.path;
        var isPublic = logic.url.isPublic(path);
        if (isPublic) {
            next();
            return;
        }
        res.locals({
            team:req.session.team || require('./test/mock/')['Team'].team01, //TODO,
            login_user:req.session.user || null
        });

        next();
    });


    app.get('/', r.index.index);

    app.post('/auth', r.login.auth);
    app.post('/logout', r.login.logout);


    app.all('/team/:name/*', r.team.all);
    app.get('/team/:name', function (req, res) {
        res.redirect(['/team', req.params.name, 'daily'].join('/'));
    });
    app.get('/team/:name/', r.daily.index);
    app.get('/team/:name/daily', r.daily.index);
    app.get('/team/:name/think_back', r.think_back.index);
    app.get('/team/:name/setting', r.setting.index);

    app.post('/new_team', r.team.new);
    app.post('/remove_team', r.team.remove);

    app.get('/sprint/issue_count', r.sprint.issue_count);
    app.get('/sprint/task_time', r.sprint.task_time);
    app.post('/sprint/new', r.sprint.new);
    app.post('/sprint/update', r.sprint.update);
    app.post('/sprint/update_keep_in_mind', r.sprint.update_keep_in_mind);
    app.post('/sprint/remove', r.sprint.remove);

    app.get('/setting/get_redmine_projects', r.setting.getRedmineProjects);


})(require('./routes'));

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});



(function (launch) {
    //load launch data for db
    launch.load();
})(require('./db/data/launch'));



var RedmineAgent = require('./agent')['Redmine'];
(function (conf) {
    var admin = new RedmineAgent();
    admin.auth = conf.auth;

    setInterval(function () {
        login(function(){
            setTimeout(function(){
                login();//try twice
            }, 3 * 1000);
        });
    }, 10 * 60 * 1000);

    function login(fail){
        admin.login(admin.auth, function (success) {
            if (success) {
                console.log('[redmine] did login to redmine at', conf.url.base);
            } else {
                console.error('[redmine] failed to login redmine');
                fail && fail();
            }
        });
    }
    login();

    RedmineAgent.admin = admin;
})(require('./conf'));
