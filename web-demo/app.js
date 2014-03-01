
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

//var redis = require('redis');
//var db = redis.createClient();

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

//redis
//app.use(function(req, res, next){
//  var ua = req.headers['user-agent'];
//  debugger;
//  db.zadd('online', Date.now(), ua, next);
//});
//
//app.use(function(req, res, next){
//  var min = 60 * 1000;
//  var ago = Date.now() - min;
//  db.zrevrangebyscore('online', '+inf', ago, function(err, users){
//    if (err) return next(err);
//    req.online = users;
//    next();
//  });
//});

app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/online', function(req, res){
  debugger;
  res.send(req.online.length + ' users online');
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/login',function(req, res){
    res.render('index', {"user":{"persona":"david"}});
});

app.get('/profile',function(req, res){
    res.render('profile', {"user":{"persona":"david"}});
});

app.get('/contest/:cid',function(req, res){
    res.render('contest', {"user":{"persona":"david"}});
});

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
