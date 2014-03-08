require('../../util/stringUtil');

var NotFoundError = require('../../error/notFoundError');
var dao = require('../../dao/user/userWalletDAO');

exports.getUserWallet = function (uid, cb) {
    dao.getUserProfile(uid, function (err, userWallet) {
        if (err) {
            cb(err, null);
            return;
        }
        if (!userWallet)cb(new NotFoundError('not found user wallet of user_id ' + uid), null);
        cb(null, JSON.stringify(userWallet));
    })
};