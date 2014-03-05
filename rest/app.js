var express = require('express');
var app = express();
var domain = require('domain');

var logUtil = require('./util/logUtil.js');
var logger = logUtil.logger('main');
var log4js = logUtil.log4js();

//app.set('port', process.env.PORT || 3000);
//app.use(express.logger('dev'));

app.use(function (req, res, next) {
    var reqDomain = domain.create();
    reqDomain.on('error', function (err) {
        logger.error(err);
        if (!err.statusCode) {
            res.send(500, err.stack);
        } else {
            res.send(err.message, err.statusCode);
        }
        res.end();
    });

    reqDomain.run(next);
});

app.use(express.bodyParser());
app.use(log4js.connectLogger(logger, {level: log4js.levels.INFO}));
app.use(app.router);

app.use(function (err, req, res, next) {
    if (!err) return next();
    logger.error(err);
    if (!err.statusCode) {
        res.send(500, err.stack);
    } else {
        res.send(err.message, err.statusCode);
    }
    res.end();
});

//services
var userService = require('./service/user/userService.js');
var userProfileService = require('./service/user/userProfileService.js');
var userWalletService = require('./service/user/userWalletService.js');
var activityService = require('./service/activity/activityService.js');
var relationshipService = require('./service/relationship/relationshipService.js');

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
app.get('/1/users/auth', function (req, res, next) {
    userService.authUser(req.query.email, req.query.persona, req.query.pwd, function (err, user) {
        if (err) next(err);
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
        if (err) next(err);
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
        if (err) next(err);
        res.end(user);
    });
});

/*
 get user_account by user_id

 input:
 params
 uids (split by ,)

 output:
 list of user
 */
app.get('/1/bulkusers', function (req, res, next) {
    var uids = req.query.uids.split(',');

    userService.getUsers(uids, function (err, user) {
        if (err) next(err);
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
app.put('/1/users/:uid', function (req, res, next) {
    userService.updateUser(req.params.uid, req.body, function (err, user) {
        if (err) next(err);
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
        if (err) next(err);
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
        if (err) next(err);
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
app.get('/1/users/:uid/profile', function (req, res, next) {
    userProfileService.getUserProfile(req.params.uid, function (err, userProfile) {
        if (err) next(err);
        res.end(userProfile);
    });
});

/*
 post user_profile (create or update)

 input:
 params
 uid
 body
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
app.post('/1/users/:uid/profile', function (req, res, next) {
    userProfileService.createOrUpdateUserProfile(req.params.uid, req.body, function (err, userProfile) {
        if (err) next(err);
        res.end(userProfile);
    });
});

/*
 get user_profile

 input:
 params
 user_id

 output:
 list of activities
 */
app.get('/1/users/:uid/activities', function (req, res, next) {
    activityService.getUserActivity(req.params.uid, function (err, activites) {
        if (err) next(err);
        res.end(activites);
    })
});

/*
 get user_profile

 input:
 params
 user_id
 body
 type
 content

 output:
 activity
 */
app.post('/1/users/:uid/activities', function (req, res, next) {
    activityService.createActivity(req.params.uid, req.body, function (err, activity) {
        if (err) next(err);
        res.end(activity);
    });
});

/*
 get user_wallet

 input:
 params
 user_id

 output:
 user_wallet
 */
app.get('/1/users/:uid/wallet', function (req, res, next) {
    userWalletService.getUserWallet(req.params.uid, function (err, userWallet) {
        if (err) next(err);
        res.end(userWallet);
    });
});

/*
 get user_wallet

 input:
 params
 user_id
 body
 mission_id

 output:
 mission
*/
app.post('/1/users/:uid/mission', function (req, res, next) {

});


/*
 get follows

 input:
 params
 user_id

 output:
 list of user_ids
 */
app.get('/1/users/:uid/follows', function (req, res, next) {
    relationshipService.getFollows(req.params.uid, function (err, uids) {
        if (err) next(err);
        res.end(uids);
    });
});

/*
 get fans

 input:
 params
 user_id

 output:
 list of user_ids
 */
app.get('/1/users/:uid/fans', function (req, res, next) {
    relationshipService.getFans(req.params.uid, function (err, uids) {
        if (err) next(err);
        res.end(uids);
    });
});

/*
 get relationship

 input:
 body
 leader_id
 follower_id

 output:
 relationship
 */
app.get('/1/relationship/', function (req, res, next) {
    relationshipService.getRelationship(req.body.leader_id, req.body.follower_id, function (err, relationship) {
        if (err) next(err);
        res.end(relationship);
    });
});

/*
 post relationship

 input:
 body
 leader_id
 follower_id

 output:
 true
 */
app.post('/1/relationship/', function (req, res, next) {
    relationshipService.createRelationship(req.body.leader_id, req.body.follower_id, function (err, result) {
        if (err) next(err);
        res.end(result);
    });
});

/*
 delete relationship

 input:
 body
 leader_id
 follower_id

 output:
 true
 */
app.delete('/1/relationship/', function (req, res, next) {
    relationshipService.deleteRelationship(req.body.leader_id, req.body.follower_id, function (err, result) {
        if (err) next(err);
        res.end(result);
    });
});

/*
 get contest_follows
 input
 params
 contest_id

 list
 user_ids
 */
app.get('/1/contest/:cid/follows', function (req, res, next) {

});

app.post('/1/contest/:cid/follows', function (req, res, next) {

});

//messages
app.get('/1/users/:uid/messages', function (req, res, next) {

});

app.post('/1/users/:uid/messages', function (req, res, next) {

});


//works
app.get('/1/users/:id/works', function (req, res, next) {

});

app.post('/1/users/:id/works', function (req, res, next) {

});

app.get('/1//works/:wid', function (req, res, next) {

});

app.put('/1/works/:wid', function (req, res, next) {

});

//vote
app.get('/1/works/:id/voteNum', function (req, res, next) {

});

app.post('/1/vote', function (req, res, next) {

});

app.listen(3000);
console.log('Listening on port 3000');
