/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , path = require('path')
    , msg = require('./msg')
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
    app.get('/', r.index);
    app.get('/daily', r.daily.index);
    app.get('/think_back', r.think_back.index);
    app.post('/auth', r.login.auth);
    app.post('/logout', r.login.logout);
})(require('./routes'));

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
