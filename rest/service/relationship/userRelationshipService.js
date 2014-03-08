require('../../util/stringUtil');

var NotFoundError = require('../../error/notFoundError');
var ConflictError = require('../../error/conflictError');

var dao = require('../../dao/relationship/userRelationshipDAO');

exports.checkRelationship = function (lid, fid, cb) {
    dao.checkRelationship(lid, fid, function(err, r){
        if (err) {
            cb(err, null);
            return;
        }
        if(!r){
            cb(new NotFoundError('not exist relationship ' + fid + ' follow ' + lid), null);
            return;
        }
        cb(null, JSON.stringify(r));
    })
};

exports.getFollows = function (uid, cb) {
    dao.getFollows(uid, function (err, uids) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(uids));
    })
};

exports.getFans = function (uid, cb) {
    dao.getFans(uid, function (err, uids) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, JSON.stringify(uids));
    })
};

exports.createRelationship = function (lid, fid, cb) {
   dao.checkRelationship(lid, fid, function(err, r){
        if (err) {
            cb(err, null);
            return;
        }
        if(r){
            cb(new ConflictError('existed relationship ' + fid + ' follow ' + lid), null);
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
   dao.checkRelationship(lid, fid, function(err, r){
        if (err) {
            cb(err, null);
            return;
        }
        if(!r){
            cb(new ConflictError('not exist relationship ' + fid + ' follow ' + lid), null);
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