require('../../util/stringUtil');

var logger = require('../../util/logUtil').logger('userRelationshipDAO');

var pool = require('../../db/mysqlconnpool');
var squel = require('squel');
var tableDefs = require('../../db/tableDefs');
var sqlHelper = require('../../db/sqlHelper');

var UserRelationship = require('../../model/relationship/userRelationship');

//tables
var userRelationship = tableDefs.userRelationship;

exports.checkRelationship = function (lid, fid, cb) {
    var query = squel.select();
    query.from(userRelationship.name)
        .where(userRelationship.leader_id + " = '" + lid + "'")
        .where(userRelationship.follower_id + " = '" + fid + "'")
        .where(userRelationship.status + "= 1");//active

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        if(rows && rows.length > 0){
            cb(null, new UserRelationship(rows[0]));
        }else{
            cb(null, null);
        }
    });
}

exports.getFollows = function (uid, cb) {
    var query = squel.select();
    query.from(userRelationship.name)
        .where(userRelationship.follower_id + " = '" + uid + "'")
        .where(userRelationship.status + "= 1");//active

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        var follows = new Array();
        for(var i=0; i<rows.length; i++) follows.push(rows[i].LEADER_ID);
        cb(null, follows);
    });
}

exports.getFans = function (uid, cb) {
    var query = squel.select();
    query.from(userRelationship.name)
        .where(userRelationship.leader_id + " = '" + uid + "'")
        .where(userRelationship.status + "= 1");//active

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        var fans = new Array();
        for(var i=0; i<rows.length; i++) fans.push(rows[i].FOLLOWER_ID);
        cb(null, fans);
    });
}

exports.createRelationship = function (lid, fid, cb) {
    var query = squel.insert();
    query.into(userRelationship.name)
        .set(userRelationship.leader_id, lid)
        .set(userRelationship.follower_id, fid)
        .set(userRelationship.modify_time, sqlHelper.dateFormat(new Date()));

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, true);
    });
}

exports.deleteRelationship = function (lid, fid, cb) {
    var query = squel.update();
    query.table(userRelationship.name)
        .set(userRelationship.status, 0)
        .where(userRelationship.leader_id + "='" + lid + "'")
        .where(userRelationship.follower_id + "='" + fid + "'");

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, true);
    });
}