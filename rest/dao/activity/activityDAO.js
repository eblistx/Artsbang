require('../../util/stringUtil.js');

var logger = require('../../util/logUtil.js').logger('activityDAO');

var pool = require('../../db/mysqlconnpool.js');
var squel = require('squel');
var tableDefs = require('../../db/tableDefs.js');
var sqlHelper = require('../../db/sqlHelper.js');

var Activity = require('../../model/activity/activity.js');

//tables
var activity = tableDefs.activity;

exports.getUserActivities = function (uid, cb) {
    var query = squel.select();
    query.from(activity.name)
        .where(activity.user_id + " = '" + uid + "'")
        .where(activity.status + "= 1");//active

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        var activities = new Array();
        for (var i = 0; i < rows.length; i++) activities.push(new Activity(rows[i]));
        cb(null, activities);
    });
}

exports.getActivity = function (aid, cb) {
    var query = squel.select();
    query.from(activity.name)
        .where(activity.activity_id + " = '" + aid + "'")
        .where(activity.status + "= 1");//active

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        if (rows.length > 0) {
            cb(null, new Activity(rows[0]));
        } else {
            cb(null, null)
        }
    });
}

exports.createActivity = function (uid, params, cb) {
    var type = params.type;
    var content = params.content;

    var query = squel.insert();
    query.into(activity.name)
        .set(activity.user_id, uid)
        .set(activity.type, type)
        .set(activity.content, content)
        .set(activity.modify_time, sqlHelper.dateFormat(new Date()));

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        var aid = rows.insertId;
        exports.getActivity(aid, function (err, activity) {
            cb(err, activity);
        });
    });
}

exports.updateActivity = function (aid, params, cb) {
    var type = params.type;
    var content = params.content;

    var query = squel.update();
    query.table(activity.name)
        .set(activity.type, type)
        .set(activity.content, content)
        .set(activity.modify_time, sqlHelper.dateFormat(new Date()))
        .where(activity.activity_id + "='" + aid + "'");

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        exports.getActivity(aid, function (err, activity) {
            cb(err, activity);
        });
    });
}