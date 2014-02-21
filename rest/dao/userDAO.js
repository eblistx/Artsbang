require('../util/stringUtil.js');

var pool = require('../db/mysqlconnpool.js');
var User = require('../model/user.js');
var logger = require('../util/logUtil.js').logger('userDAO');

exports.authUser = function(id, pwd, cb){
    var sql = "Select * from artsbang.user_password where user_id = '{0}' && password = '{1}';";
    sql = String.format(sql, id, pwd);
    pool.execute(sql, function(err, rows){
        if(err) cb(err, null);
        if(rows.length > 0){
            cb(null, true);
        }else{
            cb(null, false);
        }
    });
}

exports.setPassword = function(id, pwd, cb){
    var sql = "Select * from artsbang.user_password where user_id='{0}';";
    sql = String.format(sql, id);
    pool.execute(sql, function(err, rows){
        if(err) cb(err, null);
        if(rows.length > 0){
            //update
            sql = "Update artsbang.user_password set password = '{0}' where user_id = '{1}';";
            sql = String.format(sql, pwd, id);
            pool.execute(sql, function(err, rows){
                if(err) cb(err, null);
                if(rows.length > 0){
                    cb(null, true);
                }else{
                    cb(null, false);
                }
            });
        }else{
            //create
            sql = "Insert into artsbang.user_password (user_id, password) values ('{0}','{1}');";
            sql = String.format(sql, id, pwd);
            pool.execute(sql, function(err, rows){
                if(err) cb(err, null);
                if(rows.length > 0){
                    cb(null, true);
                }else{
                    cb(null, false);
                }
            });
        }
    });
}

exports.isLegalRole = function(role){
    if(role != '1' && role !='2')return false;
    return true;
};

exports.getUser = function(query, cb){
    var id = query.id;
    var email = query.email;
    var persona = query.persona;
    var nick = query.nick;

    var sql = "Select * from artsbang.user_account where "
    var where = "";
    if(id) where += "user_id = '" + id + "'";
    if(email) {
        if(where.length > 0) where += " and ";
        where += "email = '" + email + "'";
    }
    if(persona) {
        if(where.length > 0) where += " and ";
        where += "persona= '" + persona + "'";
    }
    if(nick) {
        if(where.length > 0) where += " and ";
        where += "nick= '" + nick + "'";
    }
    sql = sql + where;
    logger.trace(sql);

    pool.execute(sql, function(err, rows){
        if(err) cb(err, null);
        if(rows.length > 0){
            cb(null, new User(rows[0]));
        }else{
            cb(null, null);
        }
    });
};

exports.searchUser = function(query, cb){
    var email = query.email;
    var persona = query.persona;
    var nick = query.nick;

    var sql = "Select * from artsbang.user_account where "
    var where = "";
    if(email) where += "email = '" + email + "'";
    if(persona) {
        if(where.length > 0) where += " or ";
        where += "persona= '" + persona + "'";
    }
    if(nick) {
        if(where.length > 0) where += " or ";
        where += "nick= '" + nick + "'";
    }
    sql = sql + where;
    logger.trace(sql);

    pool.execute(sql, function(err, rows){
        if(err) cb(err, null);
        if(rows.length > 0){
            var users = new Array();
            for(var i=0; i<rows.length; i++){
                users.push(new User(rows[i]));
            }
            cb(null, users);
        }else{
            cb(null, null);
        }
    });
};

exports.createUser = function(params, cb){
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;
    var role = params.role;

    var sql = "Insert into artsbang.user_account (email, persona, nick, status, role) values ('{0}','{1}','{2}', 1, '{3}');";
    sql = String.format(sql, email, persona, nick, role);

    logger.trace(sql);
    pool.execute(sql, function(err, rows){
        if(err) cb(err, null);
        var id = rows.insertId;
        var query = new Object();
        query.id = id;
        exports.getUser(query, cb);
    });
};

exports.updateUser = function(id, params, cb){
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;
    var role = params.role;

    var sql = "Update artsbang.artists_account set ";
    var body = "";
    if(email)body += "email = '" + email + "'";
    if(persona) {
        if(body.length > 0) body += " , ";
        body += "persona= '" + persona + "'";
    }
    if(nick) {
        if(body.length > 0) body += " , ";
        body += "nick= '" + nick + "'";
    }
    if(role) {
        if(body.length > 0) body += " , ";
        body += "role= '" + role + "'";
    }

    sql = sql + body + " where user_id='" + id + "'";
    logger.trace(sql);
    pool.execute(sql, function(err, rows){
        if(err) cb(err, null);
        var query = new Object();
        query.id = id;
        exports.getUser(query, cb);
    });
};