var express = require('express');
var app = express();
var expressValidator = require('express-validator');

var logUtil = require('./util/logUtil.js');
var logger = logUtil.logger('main');
var log4js = logUtil.log4js();

var domain = require('domain');
app.use(function (req, res, next) {
    var reqDomain = domain.create();
    reqDomain.on('error', function (err) {
        logger.error(err);
        if(!err.statusCode){
            res.send(500, err.stack);
        }else{
            res.send(err.message, err.statusCode);
        }
        res.end();
    });

    reqDomain.run(next);
});

app.use(express.bodyParser());
app.use(expressValidator());

app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
app.use(app.router);

app.use(function(err, req, res, next) {
    if(!err) return next();
    logger.error(err);
    if(!err.statusCode){
        res.send(500, err.stack);
    }else{
        res.send(err.message, err.statusCode);
    }
    res.end();
});

var user = require('./routes/user');
var userProfile = require('./routes/userProfile');
var userWallet = require('./routes/userWallet');

var activity = require('./routes/activity');

var message = require('./routes/message');

var userRelationship = require('./routes/userRelationship');


//auth api
app.get('/1/users/auth', user.authUser);
app.post('/1/users/:uid/pwd', user.setPassword);

//user account api
app.get('/1/users', user.getUser);
app.get('/1/users/:uid', user.getUser);
app.post('/1/users/search', user.searchUser);
app.post('/1/users', user.createUser);
app.put('/1/users/:uid', user.updateUser);

//user profile api
app.get('/1/users/:uid/profile', userProfile.getUserProfile);
app.post('/1/users/:uid/profile', userProfile.createOrUpdateUserProfile);

//user wallet api
app.get('/1/users/:uid/wallet', userWallet.getUserWallet);

//activity api
app.get('/1/users/:uid/activities', activity.getActivities);
app.post('/1/users/:uid/activities', activity.createActivity);

//messages api
app.get('/1/users/:uid/messages', message.getMessages);
app.post('/1/users/:uid/messages', message.createMessage);

//user relationship api
app.get('/1/users/:uid/follows', userRelationship.getFollows);
app.get('/1/users/:uid/fans', userRelationship.getFans);
app.get('/1/users/:lid/fans/:fid', userRelationship.checkRelationship);
app.post('/1/users/:uid/fans', userRelationship.createRelationship);
app.delete('/1/users/:lid/fans/:fid', userRelationship.deleteRelationship);


//contest
app.get('/1/contest/:cid/follows', function(req, res, next){

});

app.post('/1/contest/:cid/follows', function(req, res, next){

});




//works
app.get('/1/users/:id/works', function(req, res, next){

});

app.post('/1/users/:id/works', function(req, res, next){

});

app.get('/1//works/:wid', function(req, res, next){

});

app.put('/1/works/:wid', function(req, res, next){

});

//vote
app.get('/1/works/:id/voteNum', function(req, res, next){

});

app.post('/1/vote', function(req, res, next){

});

//artists mission
app.get('/1/users/:id/artist/missions', function(req, res, next){

});

app.post('/1/users/:id/artist/mission/:mid', function(req, res, next){

});

app.listen(3000);
console.log('Listening on port 3000');
