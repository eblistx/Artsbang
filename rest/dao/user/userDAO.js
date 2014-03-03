require('../../util/stringUtil.js');

var logger = require('../../util/logUtil.js').logger('userDAO');

var pool = require('../../db/mysqlconnpool.js');
var User = require('../../model/user/user.js');
var squel = require('squel');
var tableDefs = require('../../db/tableDefs.js');
var sqlHelper = require('../../db/sqlHelper.js');

//tables
var user_password = tableDefs.user_password;
var user_account = tableDefs.user_account;

exports.authUser = function (uid, pwd, cb) {
    var query = squel.select();
    query.from(user_password.name)
        .where(user_password.user_id + " = '" + uid + "'")
        .where(user_password.password + " = '" + pwd + "'");
    var sql = query.toString();

    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        if (rows.length > 0) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    });
}

exports.setPassword = function (uid, pwd, cb) {
    var query = squel.select();
    query.from(user_password.name)
        .where(user_password.user_id + " = '" + uid + "'");
    var sql = query.toString();

    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        if (rows.length > 0) {
            //update
            query = squel.update();
            query.table(user_password.name)
                .set(user_password.password, pwd)
                .set(user_password.modify_time, sqlHelper.dateFormat(new Date()))
                .where(user_password.user_id + " = '" + uid + "'");
            sql = query.toString();
            pool.execute(sql, function (err, rows) {
                if (err) {
                    cb(err, null);
                    return;
                }
                if (rows.length > 0) {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            });
        } else {
            //create
            query = squel.insert();
            query.into(user_password.name)
                .set(user_password.user_id, uid)
                .set(user_password.password, pwd)
                .set(user_password.modify_time, sqlHelper.dateFormat(new Date()));
            sql = query.toString();
            pool.execute(sql, function (err, rows) {
                if (err) {
                    cb(err, null);
                    return;
                }
                if (rows.length > 0) {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            });
        }
    });
}

exports.isLegalRole = function (role) {
    if (role != '1' && role != '2')return false;
    return true;
};

exports.getUser = function (query, cb) {
    var uid = query.uid;
    var email = query.email;
    var persona = query.persona;
    var nick = query.nick;

    var query = squel.select();
    query.from(user_account.name);
    if (uid) query.where(user_account.user_id + "='" + uid + "'");
    if (email) query.where(user_account.email + "='" + email + "'");
    if (persona) query.where(user_account.persona + "='" + persona + "'");
    if (nick) query.where(user_account.nick + "='" + nick + "'");
    var sql = query.toString();

    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        if (rows.length > 0) {
            cb(null, new User(rows[0]));
        } else {
            cb(null, null);
        }
    });
};

exports.searchUser = function (query, cb) {
    var email = query.email;
    var persona = query.persona;
    var nick = query.nick;

    var query = squel.select();
    query.from(user_account.name);
    var where = "";
    if (email) where += user_account.email + " = '" + email + "'";
    if (persona) {
        if (where.length > 0) where += " OR ";
        where += user_account.persona + " = '" + persona + "'";
    }
    if (nick) {
        if (where.length > 0) where += " OR ";
        where += user_account.nick + " = '" + nick + "'";
    }
    query.where(where);

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        var users = new Array();
        for (var i = 0; i < rows.length; i++) users.push(new User(rows[i]));
        cb(null, users);
    });
};

exports.createUser = function (params, cb) {
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;
    var role = params.role;
    var regSource = params.regSource;

    var now = sqlHelper.dateFormat(new Date());
    var query = squel.insert();
    query.into(user_account.name)
        .set(user_account.email, email)
        .set(user_account.persona, persona)
        .set(user_account.nick, nick)
        .set(user_account.status, 1)
        .set(user_account.role, role)
        .set(user_account.email_status, 0)
        .set(user_account.registration_source, regSource)
        .set(user_account.create_time, now)
        .set(user_account.modify_time, now);

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        var uid = rows.insertId;
        var query = new Object();
        query.uid = uid;
        exports.getUser(query, cb);
    });
};

exports.updateUser = function (uid, params, cb) {
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;
    var role = params.role;

    var query = squel.update();
    query.table(user_account.name);
    if (email) query.set(user_account.email, email);
    if (persona) query.set(user_account.persona, persona);
    if (nick) query.set(user_account.nick, nick);
    if (role) query.set(user_account.role, role);
    query.set(user_account.modify_time, sqlHelper.dateFormat(new Date()));
    query.where(user_account.user_id + " = '" + uid + "'");

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        var query = new Object();
        query.uid = uid;
        exports.getUser(query, cb);
    });
};

exports.getUsers = function (uids, cb) {
    var query = squel.select();
    query.from(user_account.name);
    query.where(user_account.user_id + " in (" + uids.join(',') +")");
    var sql = query.toString();

    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        var users = new Array();
        for (var i = 0; i < rows.length; i++) users.push(new User(rows[i]));
        cb(null, users);
    });
};