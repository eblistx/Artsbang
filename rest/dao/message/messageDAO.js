require('../../util/stringUtil');

var logger = require('../../util/logUtil').logger('messageDAO');

var pool = require('../../db/mysqlconnpool');
var squel = require('squel');
var tableDefs = require('../../db/tableDefs');
var sqlHelper = require('../../db/sqlHelper');

var Message = require('../../model/message/message');

//tables
var message = tableDefs.message;

exports.gerUserMessages = function (uid, cb) {
    var query = squel.select();
    query.from(message.name)
        .where(message.user_id + " = '" + uid + "'")
        .where(message.status + "= 1");//active

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        var messages = new Array();
        for (var i = 0; i < rows.length; i++) messages.push(new Message(rows[i]));
        cb(null, messages);
    });
}

exports.getMessage = function (mid, cb) {
    var query = squel.select();
    query.from(message.name)
        .where(message.message_id + " = '" + mid + "'")
        .where(message.status + "= 1");//active

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        if (rows.length > 0) {
            cb(null, new Message(rows[0]));
        } else {
            cb(null, null)
        }
    });
}

exports.createMessage = function (uid, params, cb) {
    var type = params.type;
    var content = params.content;
    var source = params.source;
    var sourceId = params.sourceId;

    var query = squel.insert();
    query.into(message.name)
        .set(message.user_id, uid)
        .set(message.type, type)
        .set(message.content, content)
        .set(message.source, source)
        .set(message.source_id, sourceId)
        .set(message.modify_time, sqlHelper.dateFormat(new Date()));

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        var mid = rows.insertId;
        exports.getMessage(mid, function (err, message) {
            cb(err, message);
        });
    });
}

exports.updateMessage = function (mid, params, cb) {
    var type = params.type;
    var content = params.content;
    var source = params.source;
    var sourceId = params.sourceId;

    var query = squel.update();
    query.table(message.name);

    if (type)query.set(message.type, type);
    if (content)query.set(message.content, content);
    if (source)query.set(message.source, source);
    if (sourceId)query.set(message.sourceId, sourceId);

    query.set(message.modify_time, sqlHelper.dateFormat(new Date()))
        .where(message.message_id + "='" + mid + "'");

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        exports.getMessage(mid, function (err, message) {
            cb(err, message);
        });
    });
}