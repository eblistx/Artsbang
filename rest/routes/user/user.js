var userService = require('../../service/user/userService');
var BadRequestError = require('../../error/badRequestError');

validateRole = function(role){
    var errs = null;
    if (role != '1' && role != '2'){
        errs = [{
            param: "role",
            msg: "invalid role",
            value: role
        }];
    }
    return errs;
}

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
exports.authUser = function (req, res, next) {
    req.assert('pwd', 'invalid pwd').notEmpty();
    if(req.query.email){
        req.assert('email', 'invalid email').isEmail();
    }
    if(req.query.persona){
        req.assert('persona', 'invalid persona').notEmpty();
    }
    if(!req.query.email && !req.query.persona){
        req.assert('email', 'missing email or persona').notEmpty();
    }

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    var params = {
        email: req.query.email,
        persona: req.query.persona,
        pwd: req.query.pwd
    };
    userService.authUser(params, function (err, user) {
        if (err) next(err);
        res.end(user);
    });
};

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
exports.setPassword = function (req, res, next) {
    req.assert('uid', 'invalid user_id').notEmpty().isInt();
    req.checkBody('pwd', 'invalid pwd').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    userService.setPassword(req.params.uid, req.body.pwd, function (err, result) {
        if (err) next(err);
        res.end(result);
    });
};

/*
 get user_account

 input:
 query
 uid(optional)
 email(optional)
 persona(optional)
 homepage(optional)

 output:
 user

 or

 get user_account by user_id

 input:
 params
 uid

 output:
 user
 */
exports.getUser = function (req, res, next) {
    if(req.params.uid){
        req.assert('uid', 'invalid user_id').notEmpty().isInt();

        var errors = req.validationErrors();
        if (errors) {
            next(new BadRequestError(JSON.stringify(errors)));
            return;
        }

        var params = {
            uid: req.params.uid
        };
        userService.getUser(params, function (err, user) {
            if(err) next(err);
            res.end(user);
        });
    }else{
        if(req.query.uid){
            req.assert('uid', 'invalid user_id').notEmpty().isInt();
        }
        if(req.query.email){
            req.assert('email', 'invalid email').notEmpty().isEmail();
        }
        if(req.query.persona){
            req.assert('persona', 'invalid persona').notEmpty();
        }
        if(req.query.homepage){
            req.assert('homepage', 'invalid homepage').notEmpty();
        }
        if(!req.query.uid && !req.query.email
             && !req.query.persona && !req.query.homepage){
            req.assert('uid', 'not enough param').notEmpty().isInt();
        }

        var errors = req.validationErrors();
        if (errors) {
            next(new BadRequestError(JSON.stringify(errors)));
            return;
        }

        var params = {
            uid: req.query.uid,
            email: req.query.email,
            persona: req.query.persona,
            homepage: req.query.homepage
        };
        userService.getUser(params, function (err, user) {
            if(err) next(err);
            res.end(user);
        });
    }
};

/*
 post search user_account

 input:
 body
 email(optional)
 persona(optional)
 homepage(optional)

 output:
 list of user
 */
exports.searchUser = function (req, res, next) {
    if(req.body.email){
        req.checkBody('email', 'invalid email').notEmpty().isEmail();
    }
    if(req.body.persona){
        req.checkBody('persona', 'invalid persona').notEmpty();
    }
    if(req.body.homepage){
        req.checkBody('homepage', 'invalid homepage').notEmpty();
    }
    if(!req.body.email && !req.body.persona && !req.body.homepage){
        req.checkBody('email', 'not enough param').notEmpty();
    }

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    var params = {
        email: req.body.email,
        persona: req.body.persona,
        homepage: req.body.homepage
    };

    userService.searchUser(params, function (err, users) {
        if(err) next(err);
        res.end(users);
    });
};

/*
 post user_account

 input:
 body
 email
 persona
 homepage
 regSource(optional)
 role
 pwd

 output:
 user
 */
exports.createUser = function (req, res, next){
    req.checkBody('email', 'invalid email').notEmpty().isEmail();
    req.checkBody('persona', 'invalid persona').notEmpty();
    req.checkBody('homepage', 'invalid homepage').notEmpty();
    //req.checkBody('role', 'invalid role').notEmpty().isInt();
    req.checkBody('pwd', 'invalid pwd').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    errors = validateRole(req.body.role);
    if(errors){
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    var params = {
        email: req.body.email,
        persona: req.body.persona,
        homepage: req.body.homepage,
        regSource: req.body.regSource,
        role: req.body.role,
        pwd: req.body.pwd
    };

    userService.createUser(params, function (err, user) {
        if(err) next(err);
        res.end(user);
    });
};

/*
 put user_account by user_id

 input:
 params
 uid
 body
 email(optional)
 persona(optional)
 homepage(optional)

 output:
 user
 */
exports.updateUser = function (req, res, next){
    req.assert('uid', 'invalid user_id').notEmpty().isInt();
    if(req.body.email){
        req.checkBody('email', 'invalid email').notEmpty().isEmail();
    }
    if(req.body.persona){
        req.checkBody('persona', 'invalid persona').notEmpty();
    }
    if(req.body.homepage){
        req.checkBody('homepage', 'invalid homepage').notEmpty();
    }
    if(req.body.role){
        req.checkBody('role', 'invalid role').notEmpty().isInt();
    }
    if(!req.body.email && !req.body.persona
        && !req.body.homepage && !req.body.role){
        req.checkBody('email', 'not enough param').notEmpty();
    }

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    errors = validateRole(req.body.role);
    if(errors){
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    var params = {
        email: req.body.email,
        persona: req.body.persona,
        homepage: req.body.homepage,
        role: req.body.role
    };

    userService.updateUser(req.params.uid, params, function(err, user){
        if(err) next(err);
        res.end(user);
    });
};


