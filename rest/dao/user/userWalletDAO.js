require('../../util/stringUtil.js');

var logger = require('../../util/logUtil.js').logger('userWalletDAO');

var pool = require('../../db/mysqlconnpool.js');
var UserWallet = require('../../model/user/userWallet.js');
var squel = require('squel');
var tableDefs = require('../../db/tableDefs.js');
var sqlHelper = require('../../db/sqlHelper.js');

//tables
var user_wallet = tableDefs.user_wallet;

exports.getUserWallet = function (uid, cb) {
    var query = squel.select();
    query.from(user_wallet.name)
        .where(user_wallet.user_id + " = '" + uid + "'");

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        if (rows.length > 0) {
            cb(null, new UserWallet(rows[0]));
        } else {
            cb(null, null);
        }
    });
}

exports.createOrUpdateUserWallet = function (uid, params, cb) {
    var point1 = params.point1;
    var point2 = params.point2;
    var point3 = params.point3;
    var point4 = params.point4;
    var point5 = params.point5;

    var query = squel.select();
    query.from(user_wallet.name)
        .where(user_wallet.user_id + " = '" + uid + "'");

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        if (rows.length > 0) {
            //Update
            var wallet = new UserWallet(rows[0]);
            wallet.point1 += point1;
            wallet.point2 += point2;
            wallet.point3 += point3;
            wallet.point4 += point4;
            wallet.point5 += point5;

            query = squel.update();
            query.table(user_wallet.name);
            query.set(user_wallet.point1, wallet.point1);
            query.set(user_wallet.point2, wallet.point2);
            query.set(user_wallet.point3, wallet.point3);
            query.set(user_wallet.point4, wallet.point4);
            query.set(user_wallet.point5, wallet.point5);
            query.set(user_wallet.modify_time, sqlHelper.dateFormat(new Date()));
            query.where(user_wallet.user_id + " ='" + uid + "'");

            sql = query.toString();
            pool.execute(sql, function (err, rows) {
                if (err) {
                    cb(err, null);
                    return;
                }
                exports.getUserWallet(uid, function (err, userWallet) {
                    cb(err, userWallet);
                });
            });
        } else {
            //Create
            query = squel.insert();
            query.into(user_wallet.name);
            query.set(user_wallet.user_id, uid);
            query.set(user_wallet.point1, point1);
            query.set(user_wallet.point2, point2);
            query.set(user_wallet.point3, point3);
            query.set(user_wallet.point4, point4);
            query.set(user_wallet.point5, point5);
            query.set(user_wallet.modify_time, sqlHelper.dateFormat(new Date()))

            sql = query.toString();
            pool.execute(sql, function (err, rows) {
                if (err) {
                    cb(err, null);
                    return;
                }
                exports.getUserWallet(uid, function (err, userWallet) {
                    cb(err, userWallet);
                });
            });
        }
    });
}