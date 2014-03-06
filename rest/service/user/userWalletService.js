require('../../util/stringUtil');

var NotFoundError = require('../../error/notFoundError');
var dao = require('../../dao/user/userWalletDAO');

exports.getUserProfile = function (uid, cb) {
    dao.getUserProfile(uid, function (err, userProfile) {
        if (err) {
            cb(err, null);
            return;
        }
        if (!userProfile)cb(new NotFoundError('not found user profile of user_id ' + uid), null);
        cb(null, JSON.stringify(userProfile));
    })
};