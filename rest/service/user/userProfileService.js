require('../../util/stringUtil.js');

var NotFoundError = require('../../error/notFoundError.js');
var BadRequestError = require('../../error/badRequestError.js');
var ConflictError = require('../../error/conflictError.js');

var dao = require('../../dao/user/userProfileDAO.js');

exports.getUserProfile = function(uid, cb){
    if(!uid || !String.isPostINT(uid)){
        cb(new BadRequestError('Invalid user_id ' + uid), null);
    }

    dao.getUserProfile(uid, function(err, userProfile){
        if(err)cb(err, null);
        if(!userProfile)cb(new NotFoundError('Not found user profile of user_id ' + uid), null);
        cb(null, JSON.stringify(userProfile));
    })
};

exports.createOrUpdateUserProfile = function(uid, params, cb){
    if(!uid || !String.isPostINT(uid)){
        cb(new BadRequestError('Invalid user_id ' + uid), null);
    }

    dao.createOrUpdateUserProfile(uid, params,  function(err, userProfile){
        if(err)cb(err, null);
        cb(null, JSON.stringify(userProfile));
    })
};