var activityService = require('../service/activity/activityService');
var BadRequestError = require('../error/badRequestError');

/*
 get user_activities

 input:
 params
 user_id

 output:
 list of activities
 */
exports.getActivities = function(req, res, next){
    req.assert('uid', 'invalid user_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    activityService.getUserActivity(req.params.uid, function(err, activites){
        if(err) next(err);
        res.end(activites);
    })
};

/*
 post user_activity

 input:
 params
 user_id
 body
 type
 content

 output:
 activity
 */
exports.createActivity = function(req, res, next){
    req.assert('uid', 'invalid user_id').notEmpty().isInt();
    req.checkBody('type', 'invalid type').notEmpty().isInt();
    req.checkBody('content', 'invalid content').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    var params = {
        type: req.body.type,
        content: req.body.content
    }

    activityService.createActivity(req.params.uid, params, function(err, activity){
        if(err) next(err);
        res.end(activity);
    });
};