require('../util/stringUtil.js');

var pool = require('../db/mysqlconnpool.js');
var Artist = require('../model/artist.js');
var logger = require('../util/logUtil.js').logger('artistDAO');

exports.getArtist = function(query, cb){
    var id = query.id;
    var email = query.email;
    var persona = query.persona;
    var nick = query.nick;

    var sql = "Select * from artsbang.artists_account where "
    var where = "";
    if(id) where += "artist_id = '" + id + "'";
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
            var artistdb = rows[0];
            cb(null, new Artist(artistdb));
        }else{
            return cb(null, null);
        }
    });
}

exports.searchArtist = function(query, cb){
    var email = query.email;
    var persona = query.persona;
    var nick = query.nick;

    var sql = "Select * from artsbang.artists_account where "
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
            var artists = new Array();
            for(var i=0; i<rows.length; i++){
                artists.push(new Artist(rows[i]));
            }
            cb(null, artists);
        }else{
            return cb(null, null);
        }
    });
}

exports.createArtist = function(params, cb){
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;

    var sql = "Insert into artsbang.artists_account (email, persona, nick, status) values ('{0}','{1}','{2}', 1);";
    sql = String.format(sql, email, persona, nick);

    logger.trace(sql);
    pool.execute(sql, function(err, rows){
        if(err) cb(err, null);
        var id = rows.insertId;
        var query = new Object();
        query.id = id;
        exports.getArtist(query, cb);
    });
}

exports.updateArtist = function(id, params, cb){
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;

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

    sql = sql + body + " where artist_id='" + id + "'";
    logger.trace(sql);
    pool.execute(sql, function(err, rows){
        if(err) cb(err, null);
        var query = new Object();
        query.id = id;
        exports.getArtist(query, cb);
    });
}