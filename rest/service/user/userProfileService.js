require('../../util/stringUtil.js');

var NotFoundError = require('../../error/notFoundError.js');
var BadRequestError = require('../../error/badRequestError.js');
var ConflictError = require('../../error/conflictError.js');

exports.getUserProfile = function(uid, cb){
    if(!uid || !String.isPostINT(uid)){
        cb(new BadRequestError('Invalid user_id ' + uid), null);
    }

    

}