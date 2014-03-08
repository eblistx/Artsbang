require('../../util/stringUtil');

var NotFoundError = require('../../error/notFoundError');
var ConflictError = require('../../error/conflictError');

var dao = require('../../dao/relationship/contestRelationshipDAO');

exports.checkRelationship = function (cid, uid, cb) {
    dao.checkRelationship(cid, uid, function(err, r){
        if (err) {
            cb(err, null);
            return;
        }
        if(!r){
            cb(new NotFoundError('not exist relationship ' + cid + ' follow ' + uid), null);
            return;
        }
        cb(null, JSON.stringify(r));
    })
};

exports.getFollows = function (uid, cb) {
    dao.getFollows(uid, function (err, cids) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(cids));
    })
};

exports.getFans = function (cid, cb) {
    dao.getFans(cid, function (err, uids) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(uids));
    })
};

exports.createRelationship = function (cid, uid, cb) {
   dao.checkRelationship(cid, uid, function(err, r){
        if (err) {
            cb(err, null);
            return;
        }
        if(r){
            cb(new ConflictError('existed relationship ' + cid + ' follow ' + uid), null);
            return;
        }
        dao.createRelationship(cid, uid, function (err, result) {
            if (err) {
                cb(err, null);
                return;
            }
            cb(null, JSON.stringify(result));
        })
    })
};

exports.deleteRelationship = function (cid, uid, cb) {
   dao.checkRelationship(cid, uid, function(err, r){
        if (err) {
            cb(err, null);
            return;
        }
        if(!r){
            cb(new ConflictError('not exist relationship ' + cid + ' follow ' + uid), null);
            return;
        }
        dao.deleteRelationship(cid, uid, function (err, result) {
            if (err) {
                cb(err, null);
                return;
            }
            cb(null, JSON.stringify(result));
        })
    })
};