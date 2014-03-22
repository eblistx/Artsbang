var express = require('express');
var routes = require('./routes');
var register = require('./routes/register');
var contest = require('./routes/contest');
var user = require('./routes/user');
var statics = require('./routes/static');
var http = require('http');
var path = require('path');

var app = express();

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/register', register.register);

app.get('/contest/:cid', contest.contest);

app.get('/profile', user.profile);

app.get('/artistlist', user.artistlist);

app.get('/about', statics.about);

app.get('/login',function(req, res){
    res.render('index', {"user":{"persona":"david"}});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
