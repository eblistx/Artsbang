require('../../util/stringUtil');

var dao = require('../../dao/message/messageDAO');

exports.getUserMessages = function (uid, cb) {
    dao.getUserMessages(uid, function (err, messages) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(messages));
    })
};

exports.createMessage = function (uid, params, cb) {
    dao.createMessage(uid, params, function (err, message) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(message));
    })
};