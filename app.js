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
    (function (hbsPrecompiler) {

        require('handlebars');
        //TODO テンプレート分割
        hbsPrecompiler.watchDir(
            __dirname + "/views",
            __dirname + "/public/javascripts/handlebars.template.js",
            ['handlebars', 'hbs'] //extension
        );
    })(require('handlebars-precompiler'));
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


})(require('./routes'));

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});


(function (launch) {
    //load launch data for db
    launch.load();
})(require('./db/data/launch'));

