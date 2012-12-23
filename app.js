/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , path = require('path')
    , msg = require('./msg')
    , logic = require('./logic')
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

    app.all('/team/:name', r.team.all);

    app.get('/', r.index.index);
    app.get('/daily', r.daily.index); //TODO remove
    app.get('/think_back', r.think_back.index); //TODO remove
    app.get('/setting', r.setting.index); //TODO remove

    app.post('/auth', r.login.auth);
    app.post('/logout', r.login.logout);

    app.get('/team/:name', r.daily.index);
    app.get('/team/:name/daily', r.daily.index);
    app.get('/team/:name/think_back', r.think_back.index);
    app.get('/team/:name/setting', r.setting.index);

    app.post('/new_team', r.team.new);

    app.get('/project/issue_count', r.project.issue_count);
    app.get('/project/task_time', r.project.task_time);


})(require('./routes'));

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});


(function(launch){
    //load launch data for db
    launch.load();
})(require('./db/data/launch'));
