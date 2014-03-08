require('../../util/stringUtil.js');

var NotFoundError = require('../../error/notFoundError.js');
var BadRequestError = require('../../error/badRequestError.js');
var ConflictError = require('../../error/conflictError.js');

var dao = require('../../dao/relationship/userRelationshipDAO.js');

exports.getRelationship = function (lid, fid, cb) {
    if (!lid || !String.isPostINT(lid)) {
        cb(new BadRequestError('Invalid user_id ' + lid), null);
        return;
    }

    if (!fid || !String.isPostINT(fid)) {
        cb(new BadRequestError('Invalid user_id ' + fid), null);
        return;
    }

    dao.getRelationship(lid, fid, function(err, r){
        if (err) {
            cb(err, null);
            return;
        }
        if(!r){
            cb(new NotFoundError('Not exist relationship ' + fid + ' follow ' + lid), null);
            return;
        }
        cb(null, JSON.stringify(r));
    })
};

exports.getFollows = function (uid, cb) {
    if (!uid || !String.isPostINT(uid)) {
        cb(new BadRequestError('Invalid user_id ' + uid), null);
        return;
    }

    dao.getFollows(uid, function (err, uids) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(uids));
    })
};

exports.getFans = function (uid, cb) {
    if (!uid || !String.isPostINT(uid)) {
        cb(new BadRequestError('Invalid user_id ' + uid), null);
        return;
    }

    dao.getFans(uid, function (err, uids) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(uids));
    })
};

exports.createRelationship = function (lid, fid, cb) {
    if (!lid || !String.isPostINT(lid)) {
        cb(new BadRequestError('Invalid user_id ' + lid), null);
        return;
    }

    if (!fid || !String.isPostINT(fid)) {
        cb(new BadRequestError('Invalid user_id ' + fid), null);
        return;
    }

    dao.getRelationship(lid, fid, function(err, r){
        if (err) {
            cb(err, null);
            return;
        }
        if(r){
            cb(new ConflictError('Existed relationship ' + fid + ' follow ' + lid), null);
            return;
        }
        dao.createRelationship(lid, fid, function (err, result) {
            if (err) {
                cb(err, null);
                return;
            }
            cb(null, JSON.stringify(result));
        })
    })
};

exports.deleteRelationship = function (lid, fid, cb) {
    if (!lid || !String.isPostINT(lid)) {
        cb(new BadRequestError('Invalid user_id ' + lid), null);
        return;
    }

    if (!fid || !String.isPostINT(fid)) {
        cb(new BadRequestError('Invalid user_id ' + fid), null);
        return;
    }

    dao.getRelationship(lid, fid, function(err, r){
        if (err) {
            cb(err, null);
            return;
        }
        if(!r){
            cb(new ConflictError('Not existe relationship ' + fid + ' follow ' + lid), null);
            return;
        }
        dao.deleteRelationship(lid, fid, function (err, result) {
            if (err) {
                cb(err, null);
                return;
            }
            cb(null, JSON.stringify(result));
        })
    })
};