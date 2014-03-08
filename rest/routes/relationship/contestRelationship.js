var BadRequestError = require('../../error/badRequestError');
var relationshipService = require('../../service/relationship/contestRelationshipService');

/*
 get follows

 input:
 params
 user_id

 output:
 list of contest_ids
 */
exports.getFollows = function(req, res, next){
    req.assert('uid', 'invalid user_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    relationshipService.getFollows(req.params.uid, function(err, uids){
        if(err) next(err);
        res.end(uids);
    });
};


/*
 get fans

 input:
 params
 contest_ids

 output:
 list of user_ids
 */
exports.getFans = function(req, res, next){
    req.assert('cid', 'invalid contest_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    relationshipService.getFans(req.params.cid, function(err, uids){
        if(err) next(err);
        res.end(uids);
    });
};

/*
 get user_relationship

 input:
 params
 contest_id
 user_id

 output:
 contest_relationship
 */
exports.checkRelationship = function(req, res, next){
    req.assert('cid', 'invalid contest_id').notEmpty().isInt();
    req.assert('uid', 'invalid user_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    relationshipService.checkRelationship(req.params.cid, req.params.uid, function(err, relationship){
        if(err) next(err);
        res.end(relationship);
    });
};

/*
 post relationship

 input:
 params
 uid
 body
 uid (followers_id)

 output:
 true
 */
exports.createRelationship = function(req, res, next){
    req.assert('cid', 'invalid contest_id').notEmpty().isInt();
    req.checkBody('uid', 'invalid user_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    relationshipService.createRelationship(req.params.cid, req.body.uid, function(err, result){
        if(err) next(err);
        res.end(result);
    });
};

/*
 delete relationship

 input:
 params
 contest_id
 user_id

 output:
 true
 */
exports.deleteRelationship = function(req, res, next){
    req.assert('cid', 'invalid contest_id').notEmpty().isInt();
    req.assert('uid', 'invalid user_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    relationshipService.deleteRelationship(req.params.cid, req.params.uid, function(err, result){
        if(err) next(err);
        res.end(result);
    });
};