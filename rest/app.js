var express = require('express');
var app = express();

var logUtil = require('./util/logUtil.js');
var logger = logUtil.logger('main');
var log4js = logUtil.log4js();

//app.set('port', process.env.PORT || 3000);
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
var userService = require('./service/user/userService.js');

/*
  get auth

  input:
    query
        email(optional)
        persona(optional)
        pwd

  output:
        user
*/
app.get('/1/users/auth', function(req, res, next){
    userService.authUser(req.query, function(err, user){
        if(err) next(err);
        res.end(user);
    });
});


/*
 post pwd

 input:
     params
        uid
     body
        pwd

 output:
    result(true or false)
 */
app.post('/1/users/:uid/pwd', function (req, res, next) {
    userService.setPassword(req.params.uid, req.body.pwd, function (err, result) {
        if (err) next(err);
        res.end(result);
    });
});

/*
 get user_account

 input:
    query
        uid(optional)
        email(optional)
        persona(optional)
        nick(optional)

 output:
        user
 */
app.get('/1/users', function (req, res, next) {
    userService.getUser(req.query, function (err, user) {
        if(err) next(err);
        res.end(user);
    });
});


/*
 get user_account by user_id

 input:
     params
        uid

 output:
        user
 */
app.get('/1/users/:uid', function (req, res, next) {
    userService.getUser(req.params, function (err, user) {
        if(err) next(err);
        res.end(user);
    });
});

/*
 put user_account by user_id

 input:
    params
        uid
    body
        email(optional)
        persona(optional)
        nick(optional)

 output:
        user
 */
app.put('/1/users/:uid', function(req, res, next){
    userService.updateUser(req.params.uid, req.body, function(err, user){
        if(err) next(err);
        res.end(user);
    });
});

/*
 post user_account

 input:
    body
        email
        persona
        nick
        regSource(optional)
        role
        pwd

 output:
        user
 */
app.post('/1/users', function (req, res, next) {
    userService.createUser(req.body, function (err, user) {
        if(err) next(err);
        res.end(user);
    });
});

/*
 post search user_account

    input:
        body
            email
            persona
            nick

 output:
        list of user
 */
app.post('/1/users/search', function (req, res, next) {
    userService.searchUser(req.body, function (err, users) {
        if(err) next(err);
        res.end(users);
    });
});

/*
 get user_profile

 input:
     params
        user_id

 output:
        user_profile
*/
app.get('/1/users/:uid/profile', function(req, res, next){


});

/*
 post user_profile (create or update)

 input:
        uid
        icon(optional)
        blog(optional)
        desc(optional)
        gender(optional)
        location(optional)
        job(optional)
        company(optional)

 output:
        user_profile
 */
app.post('/1/users/:uid/profile', function(req, res, next){

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

//fans activity
app.get('/1/users/:id/artist/activities', function(req, res, next){

});

app.post('/1/users/:id/artist/activities', function(req, res, next){

});

//relationship
app.get('/1/users/:id/fans', function(req, res, next){

});

app.post('/1/relationship/', function(req, res, next){

});

//works
app.get('/1/users/:id/works', function(req, res, next){

});

app.post('/1/users/:id/works', function(req, res, next){

});

app.put('/1/users/:id/works', function(req, res, next){

});

app.get('/1/works/:id', function(req, res, next){

});

//vote
app.get('/1/works/:id/voteNum', function(req, res, next){

});

app.post('/1/vote', function(req, res, next){

});

app.listen(3000);
console.log('Listening on port 3000');
