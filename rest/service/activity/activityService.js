require('../../util/stringUtil.js');

var NotFoundError = require('../../error/notFoundError.js');
var BadRequestError = require('../../error/badRequestError.js');
var ConflictError = require('../../error/conflictError.js');

var dao = require('../../dao/activity/activityDAO.js');

exports.getUserActivity = function(uid, cb){
    if(!uid || !String.isPostINT(uid)){
        cb(new BadRequestError('Invalid user_id ' + uid), null);
    }

    dao.getUserActivities(uid, function(err, activities){
        if(err)cb(err, null);
        cb(null, JSON.stringify(activities));
    })
};

exports.createActivity = function(uid, params, cb){
    if(!uid || !String.isPostINT(uid)){
        cb(new BadRequestError('Invalid user_id ' + uid), null);
    }

    dao.createActivity(uid, params,  function(err, activity){
        if(err)cb(err, null);
        cb(null, JSON.stringify(activity));
    })
};