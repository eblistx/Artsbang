require('../../util/stringUtil.js');

var logger = require('../../util/logUtil.js').logger('userService');

var dao = require('../../dao/user/userDAO.js');

var NotFoundError = require('../../error/notFoundError.js');
var BadRequestError = require('../../error/badRequestError.js');
var ConflictError = require('../../error/conflictError.js');

exports.authUser = function (params, cb) {
    var email = params.email;
    var persona = params.persona;
    var pwd = params.pwd;

    var query = new Object();
    query.email = email;
    query.persona = persona;

    dao.getUser(query, function (err, user) {
        if (err) {
            cb(err, null);
            return;
        }
        if (!user) {
            cb(new NotFoundError('Not found user ' + JSON.stringify(query)), null);
            return;
        }
        dao.authUser(user.uid, pwd, function (err, res) {
            if (err) {
                cb(err, null);
                return;
            }
            if (res) {
                cb(null, JSON.stringify(user));
            } else {
                cb(new ConflictError('Invalid password'), null);
            }
        })
    });
}

exports.setPassword = function (uid, pwd, cb) {
    if (!uid || !String.isPostINT(uid)) {
        cb(new BadRequestError('Invalid user_id ' + uid), null);
        return;
    }

    //TODO
    if (!pwd || !pwd.length) {
        cb(new BadRequestError('Invalid pwd ' + pwd), null);
        return;
    }

    var query = new Object();
    query.uid = uid;

    dao.getUser(query, function (err, user) {
        if (err) {
            cb(err, null);
            return;
        }
        if (!user) {
            cb(new NotFoundError('Not found user ' + JSON.stringify(query)), null);
            return;
        }
        dao.setPassword(user.uid, pwd, function (err, res) {
            if (err) {
                cb(err, null);
                return;
            }
            cb(null, res);
        })
    });
}

exports.getUser = function (params, cb) {
    var uid = params.uid;
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;

    if (!uid && !email && !persona && !nick) {
        cb(new BadRequestError('Not enough params ' + JSON.stringify(params)), null);
        return;
    }

    if (uid && !String.isPostINT(uid)) {
        cb(new BadRequestError('Invalid user_id ' + uid), null);
        return;
    }

    if ((email && !email.length) || (persona && !persona.length) || (nick && !nick.length)) {
        cb(new BadRequestError('Empty params ' + JSON.stringify(params)), null);
        return;
    }

    dao.getUser(params, function (err, user) {
        if (err) {
            cb(err, null);
            return;
        }
        if (user) {
            cb(null, JSON.stringify(user));
        }else{
            cb(new NotFoundError('Not found user ' + JSON.stringify(query)), null);
        }
    });
}

exports.searchUser = function (params, cb) {
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;

    if (!email && !persona && !nick) {
        cb(new BadRequestError('Not enough params ' + JSON.stringify(params)), null);
        return;
    }

    if ((email && !email.length) || (persona && !persona.length) || (nick && !nick.length)) {
        cb(new BadRequestError('Empty params ' + JSON.stringify(params)), null);
        return;
    }

    dao.searchUser(params, function (err, users) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(users));
    });
}

exports.createUser = function (params, cb) {
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;
    var role = params.role;
    var pwd = params.pwd;

    if (!email || !persona || !nick || !role) {
        cb(new BadRequestError('Not enough params ' + JSON.stringify(params)), null);
        return;
    }

    if (!dao.isLegalRole(role)) {
        cb(new BadRequestError('Illegal role ' + JSON.stringify(params)), null);
        return;
    }

    if (!email.length || !persona.length || !nick.length) {
        cb(new BadRequestError('Empty params ' + JSON.stringify(params)), null);
        return;
    }

    //TODO
    if (!pwd || !pwd.length) {
        cb(new BadRequestError('Invalid pwd ' + pwd), null);
        return;
    }

    dao.searchUser(params, function (err, users) {
        if (err) {
            cb(err, null);
            return;
        }
        if (users && users.length > 0) {
            var conflictFields = new Array();
            for (var i = 0; i < users.length; i++) {
                var artist = users[i];
                if (artist.email === email) {
                    conflictFields.push('email');
                }
                if (artist.persona === persona) {
                    conflictFields.push('persona');
                }
                if (artist.nick === nick) {
                    conflictFields.push('nick');
                }
            }
            cb(new ConflictError(JSON.stringify(conflictFields)), null);
            return;
        }
        dao.createUser(params, function (err, user) {
            if (err) {
                cb(err, null);
                return;
            }
            exports.setPassword(user.uid, pwd, function (err, res) {
                //TODO: need to revert here?
                if (err)logger.error("Set password error, user_id = " + user.uid + ", detail: " + err);
                cb(null, JSON.stringify(user));
            });
        })
    });
}

exports.updateUser = function (uid, params, cb) {
    if (!uid || !String.isPostINT(uid)) {
        cb(new BadRequestError('Invalid user_id ' + uid), null);
        return;
    }

    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;
    var role = params.role;

    if (!email && !persona && !nick) {
        cb(new BadRequestError('Not enough params ' + JSON.stringify(params)), null);
        return;
    }

    if (!dao.isLegalRole(role)) {
        cb(new BadRequestError('Illegal role ' + JSON.stringify(params)), null);
        return;
    }

    if ((email && !email.length) || (persona && !persona.length) || (nick && !nick.length)) {
        cb(new BadRequestError('Empty params ' + JSON.stringify(params)), null);
        return;
    }

    var query = new Object();
    query.uid = uid;
    dao.getUser(query, function (err, user) {
        if (err) {
            cb(err, null);
            return;
        }
        if (!user) {
            cb(new NotFoundError('Not found user ' + JSON.stringify(query)), null);
            return;
        }
        dao.updateUser(uid, params, function (err, user) {
            if (err) {
                cb(err, null);
                return;
            }
            cb(null, JSON.stringify(user));
        })
    });
}