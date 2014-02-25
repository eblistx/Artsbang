require('../../util/stringUtil.js');

var logger = require('../../util/logUtil.js').logger('relationshipDAO');

var pool = require('../../db/mysqlconnpool.js');
var squel = require('squel');
var tableDefs = require('../../db/tableDefs.js');
var sqlHelper = require('../../db/sqlHelper.js');

var Relationship = require('../../model/relationship/relationship.js');

//tables
var relationship = tableDefs.relationship;

exports.getRelationship = function (lid, fid, cb) {
    var query = squel.select();
    query.from(relationship.name)
        .where(relationship.leader_id + " = '" + lid + "'")
        .where(relationship.follower_id + " = '" + fid + "'")
        .where(relationship.status + "= 1");//active

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        if(rows && rows.length > 0){
            cb(null, new Relationship(rows[0]));
        }else{
            cb(null, null);
        }
    });
}

exports.getFollows = function (uid, cb) {
    var query = squel.select();
    query.from(relationship.name)
        .where(relationship.follower_id + " = '" + uid + "'")
        .where(relationship.status + "= 1");//active

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
    query.from(relationship.name)
        .where(relationship.leader_id + " = '" + uid + "'")
        .where(relationship.status + "= 1");//active

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
    query.into(relationship.name)
        .set(relationship.leader_id, lid)
        .set(relationship.follower_id, fid)
        .set(relationship.modify_time, sqlHelper.dateFormat(new Date()));

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
    query.table(relationship.name)
        .set(relationship.status, 0)
        .where(relationship.leader_id + "='" + lid + "'")
        .where(relationship.follower_id + "='" + fid + "'");

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, true);
    });
}