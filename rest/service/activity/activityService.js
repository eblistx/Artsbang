require('../../util/stringUtil');

var dao = require('../../dao/activity/activityDAO');

exports.getUserActivity = function (uid, cb) {
    dao.getUserActivities(uid, function (err, activities) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(activities));
    })
};

exports.createActivity = function (uid, params, cb) {
   dao.createActivity(uid, params, function (err, activity) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(activity));
    })
};