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
            login_user:req.session.user || null
        });

        next();
    });

    app.get('/', r.index.index);
    app.get('/daily', r.daily.index);
    app.get('/think_back', r.think_back.index);
    app.post('/auth', r.login.auth);
    app.post('/logout', r.login.logout);

    app.get('/team/get', r.team.get);
    app.post('/team/save', r.team.save);
    app.post('/team/addMember', r.team.addMember);
    app.post('/team/removeMember', r.team.removeMember);
})(require('./routes'));

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
