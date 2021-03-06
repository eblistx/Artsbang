require('../../util/stringUtil');

var NotFoundError = require('../../error/notFoundError');
var dao = require('../../dao/user/userProfileDAO');

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

exports.createOrUpdateUserProfile = function (uid, params, cb) {
    dao.createOrUpdateUserProfile(uid, params, function (err, userProfile) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(userProfile));
    })
};