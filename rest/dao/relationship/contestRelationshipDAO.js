require('../../util/stringUtil');

var logger = require('../../util/logUtil').logger('contestRelationshipDAO');

var pool = require('../../db/mysqlconnpool');
var squel = require('squel');
var tableDefs = require('../../db/tableDefs');
var sqlHelper = require('../../db/sqlHelper');

var ContestRelationship = require('../../model/relationship/contestRelationship');

//tables
var contestRelationship = tableDefs.contestRelationship;

exports.checkRelationship = function (cid, uid, cb) {
    var query = squel.select();
    query.from(contestRelationship.name)
        .where(contestRelationship.contest_id + " = '" + cid + "'")
        .where(contestRelationship.follower_id + " = '" + uid + "'")
        .where(contestRelationship.status + "= 1");//active

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        if(rows && rows.length > 0){
            cb(null, new ContestRelationship(rows[0]));
        }else{
            cb(null, null);
        }
    });
}

exports.getFollows = function (uid, cb) {
    var query = squel.select();
    query.from(contestRelationship.name)
        .where(contestRelationship.follower_id + " = '" + uid + "'")
        .where(contestRelationship.status + "= 1");//active

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        var follows = new Array();
        for(var i=0; i<rows.length; i++) follows.push(rows[i].CONTEST_ID);
        cb(null, follows);
    });
}

exports.getFans = function (cid, cb) {
    var query = squel.select();
    query.from(contestRelationship.name)
        .where(contestRelationship.contest_id + " = '" + cid + "'")
        .where(contestRelationship.status + "= 1");//active

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

exports.createRelationship = function (cid, uid, cb) {
    var query = squel.insert();
    query.into(contestRelationship.name)
        .set(contestRelationship.contest_id, cid)
        .set(contestRelationship.follower_id, uid)
        .set(contestRelationship.modify_time, sqlHelper.dateFormat(new Date()));

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, true);
    });
}

exports.deleteRelationship = function (cid, uid, cb) {
    var query = squel.update();
    query.table(contestRelationship.name)
        .set(contestRelationship.status, 0)
        .where(contestRelationship.contest_id + "='" + cid + "'")
        .where(contestRelationship.follower_id + "='" + uid + "'");

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, true);
    });
}