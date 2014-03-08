var userProfileService = require('../../service/user/userProfileService');
var BadRequestError = require('../../error/badRequestError');

/*
 get user_profile

 input:
 params
 user_id

 output:
 user_profile
 */
exports.getUserProfile = function(req, res, next){
    req.assert('uid', 'invalid user_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    userProfileService.getUserProfile(req.params.uid, function(err, userProfile){
        if(err) next(err);
        res.end(userProfile);
    });
};

/*
 post user_profile (create or update)

 input:
 params
 uid
 body
 icon(optional)
 blog(optional)
 desc(optional)
 gender(optional)
 location(optional)
 job(optional)
 company(optional)

 output:
 user_profile
 */
exports.createOrUpdateUserProfile = function(req, res, next){
    req.assert('uid', 'invalid user_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    userProfileService.createOrUpdateUserProfile(req.params.uid, req.body, function(err, userProfile){
        if(err) next(err);
        res.end(userProfile);
    });
};