require('../../util/stringUtil.js');

var dao = require('../../dao/userDAO.js');

var NotFoundError = require('../../error/notFoundError.js');
var BadRequestError = require('../../error/badRequestError.js');
var ConflictError = require('../../error/conflictError.js');

exports.authUser = function(params, cb){
    var email = params.email;
    var persona = params.persona;
    var pwd = params.pwd;

    var query = new Object();
    query.email = email;
    query.persona = persona;

    dao.getUser(query, function(err, user){
        if(err) cb(err, null);
        if(!user) cb(new NotFoundError('Not found artist ' + JSON.stringify(query)), null);
        dao.authUser(user.uid, pwd, function(err, res){
            if(err) cb(err, null);
            if(res) {
                cb(null, JSON.stringify(user));
            }else{
                cb(new ConflictError('Invalid password'), null);
            }
        })
    });
}

exports.setPassword = function(uid, pwd, cb){
    if(!uid || !String.isPostINT(uid)){
        cb(new BadRequestError('Invalid user_id ' + uid), null);
    }

    //TODO
    if(!pwd || !pwd.length){
        cb(new BadRequestError('Invalid pwd ' + pwd), null);
    }

    var query = new Object();
    query.uid = uid;

    dao.getUser(query, function(err, user){
        if(err) cb(err, null);
        if(!user) cb(new NotFoundError('Not found artist ' + JSON.stringify(query)), null);
        dao.setPassword(user.uid, pwd, function(err, res){
            if(err) cb(err, null);
            cb(null, res);
        })
    });
}

exports.getUser = function(params, cb){
    var uid = params.uid;
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;

    if(!uid && !email && !persona && !nick) {
        cb(new BadRequestError('Not enough params ' + JSON.stringify(params)),null);
    }

    if(uid && !String.isPostINT(uid)){
        cb(new BadRequestError('Invalid user_id ' + uid),null);
    }

    if((email && !email.length) || (persona && !persona.length) || (nick && !nick.length)) {
        cb(new BadRequestError('Empty params ' + JSON.stringify(params)),null);
    }

    dao.getUser(params, function(err, user){
        if(err) cb(err, null);
        if(!user) cb(new NotFoundError('Not found artist ' + JSON.stringify(params)), null);
        cb(null, JSON.stringify(user));
    });
}

exports.searchUser = function(params, cb){
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;

    if(!email && !persona && !nick) {
        cb(new BadRequestError('Not enough params ' + JSON.stringify(params)),null);
    }

    if((email && !email.length) || (persona && !persona.length) || (nick && !nick.length)) {
        cb(new BadRequestError('Empty params ' + JSON.stringify(params)),null);
    }

    dao.searchUser(params, function(err, users){
        if(err) cb(err, null);
        if(!users) cb(new NotFoundError('Not found artist ' + JSON.stringify(params)), null);
        cb(null, JSON.stringify(users));
    });
}

exports.createUser = function(params, cb){
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;
    var role = params.role;
    var pwd = params.pwd;

    if(!email || !persona || !nick || !role) {
        cb(new BadRequestError('Not enough params ' + JSON.stringify(params)),null);
    }

    if(!dao.isLegalRole(role)){
        cb(new BadRequestError('Illegal role ' + JSON.stringify(params)),null);
    }

    if(!email.length || !persona.length ||!nick.length) {
        cb(new BadRequestError('Empty params ' + JSON.stringify(params)),null);
    }

    //TODO
    if(!pwd || !pwd.length){
        cb(new BadRequestError('Invalid pwd ' + pwd), null);
    }

    dao.searchUser(params, function(err, users){
        if(err) cb(err, null);
        if(users) {
            var conflictFields = new Array();
            for(var i=0; i<users.length; i++){
                var artist = users[i];
                if(artist.email === email){
                    conflictFields.push('email');
                }
                if(artist.persona === persona){
                    conflictFields.push('persona');
                }
                if(artist.nick === nick){
                    conflictFields.push('nick');
                }
            }
            cb(new ConflictError(JSON.stringify(conflictFields)), null)
        }
        dao.createUser(params, function(err, user){
            if(err) cb(err, null);
            exports.setPassword(user.uid, pwd, function(err, res){
                //TODO: need to revert here?
                cb(null, JSON.stringify(user));
            });
        })
    });
}

exports.updateUser = function(uid, params, cb){
    if(!uid || !String.isPostINT(uid)){
        cb(new BadRequestError('Invalid artist_id ' + uid),null);
    }

    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;
    var role = params.role;

    if(!email && !persona && !nick) {
        cb(new BadRequestError('Not enough params ' + JSON.stringify(params)),null);
    }

    if(!dao.isLegalRole(role)){
        cb(new BadRequestError('Illegal role ' + JSON.stringify(params)),null);
    }

    if((email && !email.length) || (persona && !persona.length) || (nick && !nick.length)) {
        cb(new BadRequestError('Empty params ' + JSON.stringify(params)),null);
    }

    var query = new Object();
    query.uid = uid;
    dao.getUser(query, function(err, user){
        if(err) cb(err, null);
        if(!user) cb(new NotFoundError('Not found artist ' + JSON.stringify(query)), null);
        dao.updateUser(uid, params, function(err, user){
            if(err) cb(err, null);
            cb(null, JSON.stringify(user));
        })
    });
}