var express = require('express');
var app = express();

var logUtil = require('./util/logUtil.js');
var logger = logUtil.logger('main');
var log4js = logUtil.log4js();

app.set('port', process.env.PORT || 3000);
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
app.use(app.router);
app.use(function(err, req, res, next) {
    if(!err) return next();
    logger.error(err);
    if(!err.statusCode)err.statusCode = 500;
    res.send(err.message, err.statusCode);
    res.end();
});

//service
var userService = require('./service/userService.js');

//authentication
app.get('/1/users/auth', function(req, res, next){
    userService.authUser(req.query, function(err, user){
        if(err) next(err);
        debugger;
        res.end(user);
    });
});

app.post('/1/users/:id/pwd', function (req, res, next) {
    userService.setPassword(req.params.id, req.body.pwd, function (err, result) {
        if (err) next(err);
        res.end(result);
    });
});

//user account
app.get('/1/users', function (req, res, next) {
    userService.getUser(req.query, function (err, user) {
        if(err) next(err);
        res.end(user);
    });
});

app.get('/1/users/:id', function (req, res, next) {
    userService.getUser(req.params, function (err, user) {
        if(err) next(err);
        res.end(user);
    });
});

app.put('/1/users/:id', function(req, res, next){
    userService.updateUser(req.params.id, req.body, function(err, user){
        if(err) next(err);
        res.end(user);
    });
});

app.post('/1/users', function (req, res, next) {
    userService.createUser(req.body, function (err, user) {
        if(err) next(err);
        res.end(user);
    });
});

app.post('/1/users/search', function (req, res, next) {
    userService.searchUser(req.body, function (err, users) {
        if(err) next(err);
        res.end(users);
    });
});

//artists profile
app.get('/1/users/:id/artist/profile', function(req, res, next){

});

app.post('/1/users/:id/artist/profile', function(req, res, next){

});

app.put('/1/users/:id/artist/profile', function(req, res, next){

});

//artists reputation/point
app.get('/1/users/:id/artist/award', function(req, res, next){

});

//artists activity
app.get('/1/users/:id/artist/activities', function(req, res, next){

});

app.post('/1/users/:id/artist/activities', function(req, res, next){

});

//artists mission
app.get('/1/users/:id/artist/missions', function(req, res, next){

});

app.post('/1/users/:id/artist/mission/:mid', function(req, res, next){

});


app.listen(3000);
console.log('Listening on port 3000');
