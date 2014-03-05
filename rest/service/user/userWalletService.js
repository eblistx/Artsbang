require('../../util/stringUtil.js');

var NotFoundError = require('../../error/notFoundError.js');
var BadRequestError = require('../../error/badRequestError.js');
var ConflictError = require('../../error/conflictError.js');

var dao = require('../../dao/user/userWalletDAO.js');

exports.getUserWallet = function (uid, cb) {
    if (!uid || !String.isPostINT(uid)) {
        cb(new BadRequestError('Invalid user_id ' + uid), null);
        return;
    }

    dao.getUserWallet(uid, function (err, userWallet) {
        if (err) {
            cb(err, null);
            return;
        }
        if (!userWallet)cb(new NotFoundError('Not found user wallet of user_id ' + uid), null);
        cb(null, JSON.stringify(userWallet));
    })
};

exports.createOrUpdateUserWallet = function (uid, params, cb) {
    if (!uid || !String.isPostINT(uid)) {
        cb(new BadRequestError('Invalid user_id ' + uid), null);
        return;
    }

    dao.createOrUpdateUserWallet(uid, params, function (err, userWallet) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(userWallet));
    })
};