var BadRequestError = require('../../error/badRequestError');
var relationshipService = require('../service/relationship/userRelationshipService');

/*
 get follows

 input:
 params
 user_id

 output:
 list of user_ids
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
 user_id

 output:
 list of user_ids
 */
exports.getFans = function(req, res, next){
    req.assert('uid', 'invalid user_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    relationshipService.getFans(req.params.uid, function(err, uids){
        if(err) next(err);
        res.end(uids);
    });
};

/*
 get user_relationship

 input:
 params
 leader_id
 follower_id

 output:
 user_relationship
 */
exports.checkRelationship = function(req, res, next){
    req.assert('lid', 'invalid leader_id').notEmpty().isInt();
    req.assert('fid', 'invalid follower_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    relationshipService.checkRelationship(req.params.lid, req.params.fid, function(err, relationship){
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
    req.assert('uid', 'invalid user_id').notEmpty().isInt();
    req.checkBody('uid', 'invalid follower_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    relationshipService.createRelationship(req.params.uid, req.body.uid, function(err, result){
        if(err) next(err);
        res.end(result);
    });
};

/*
 delete relationship

 input:
 params
 leader_id
 follower_id

 output:
 true
 */
exports.deleteRelationship = function(req, res, next){
    req.assert('lid', 'invalid leader_id').notEmpty().isInt();
    req.assert('fid', 'invalid follower_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    relationshipService.deleteRelationship(req.params.lid, req.params.fid, function(err, result){
        if(err) next(err);
        res.end(result);
    });
};