require('../../util/stringUtil.js');

var logger = require('../../util/logUtil').logger('userService');

var dao = require('../../dao/user/userDAO');

var NotFoundError = require('../../error/notFoundError');
var ConflictError = require('../../error/conflictError');

exports.authUser = function (params, cb) {
    var email = params.email;
    var persona = params.persona;
    var pwd = params.pwd;

    var query = {
        email: email,
        persona: persona
    };
    dao.getUser(query, function (err, user) {
        if (err) {
            cb(err, null);
            return;
        }
        if (!user) {
            cb(new NotFoundError('not found user ' + JSON.stringify(query)), null);
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
                cb(new ConflictError('invalid password'), null);
            }
        })
    });
}

exports.setPassword = function (uid, pwd, cb) {
    var query ={
        uid:uid
    };

    dao.getUser(query, function (err, user) {
        if (err) {
            cb(err, null);
            return;
        }
        if (!user) {
            cb(new NotFoundError('not found user ' + JSON.stringify(query)), null);
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
    dao.getUser(params, function (err, user) {
        if (err) {
            cb(err, null);
            return;
        }
        if (user) {
            cb(null, JSON.stringify(user));
        } else {
            cb(new NotFoundError('not found user ' + JSON.stringify(params)), null);
        }
    });
}

exports.searchUser = function (params, cb) {
    dao.searchUser(params, function (err, users) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(users));
    });
}

exports.createUser = function (params, cb) {
    var email = params.email,
        persona = params.persona,
        homepage = params.homepage,
        pwd = params.pwd;

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
                if (artist.homepage === homepage) {
                    conflictFields.push('homepage');
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
                if (err)logger.error("set password error, user_id = " + user.uid + ", detail: " + err);
                cb(null, JSON.stringify(user));
            });
        })
    });
}

exports.updateUser = function (uid, params, cb) {
    var query = {
        uid: uid
    };
    dao.getUser(query, function (err, user) {
        if (err) {
            cb(err, null);
            return;
        }
        if (!user) {
            cb(new NotFoundError('not found user ' + JSON.stringify(query)), null);
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