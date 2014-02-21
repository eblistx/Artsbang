var mysql = require('mysql');
var logger = require('../util/logUtil.js').logger('db');

var pool  = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'artsbang',
    password : 'artsbang'
});

exports.execute = function(sql, cb){
    logger.trace(sql);
    pool.query(sql, function(err, rows){
        logger.trace(err);
        logger.trace(rows);
        cb(err, rows);
    });
}