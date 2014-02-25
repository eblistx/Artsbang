require('../../util/stringUtil.js');

var logger = require('../../util/logUtil.js').logger('userProfileDAO');

var pool = require('../../db/mysqlconnpool.js');
var UserProfile = require('../../model/user/userProfile.js');
var squel = require('squel');
var tableDefs = require('../../db/tableDefs.js');

//tables
var user_profile = tableDefs.user_profile;

exports.getUserProfile = function (uid, cb) {
    var query = squel.select();
    query.from(user_profile.name)
        .where(user_profile.user_id + " = '" + uid + "'");

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        if (rows.length > 0) {
            cb(null, new UserProfile(rows[0]));
        } else {
            cb(null, null);
        }
    });
}

exports.createOrUpdateUserProfile = function (uid, params, cb) {
    var icon = params.icon;
    var blog = params.blog;
    var desc = params.desc;
    var gender = params.gender;
    var birth = params.birth;
    var location = params.location;
    var job = params.job;
    var company = params.company;

    var query = squel.select();
    query.from(user_profile.name)
        .where(user_profile.user_id + " = '" + uid + "'");

    var sql = query.toString();
    pool.execute(sql, function (err, rows) {
        if (err) {
            cb(err, null);
            return;
        }
        if (rows.length > 0) {
            //Update
            query = squel.update();
            query.table(user_profile.name);
            if (icon)query.set(user_profile.icon, icon);
            if (blog)query.set(user_profile.blog, blog);
            if (desc)query.set(user_profile.desc, desc);
            if (gender)query.set(user_profile.gender, gender);
            if (birth) query.set(user_profile.birth, birth);
            if (location)query.set(user_profile.location, location);
            if (job)query.set(user_profile.job, job);
            if (company)query.set(user_profile.company, company);
            query.where(user_profile.user_id + " ='" + uid + "'");

            sql = query.toString();
            pool.execute(sql, function (err, rows) {
                if (err) {
                    cb(err, null);
                    return;
                }
                exports.getUserProfile(uid, function (err, userProfile) {
                    cb(err, userProfile);
                });
            });
        } else {
            //Create
            query = squel.insert();
            query.into(user_profile.name);
            query.set(user_profile.user_id, uid);
            if (icon)query.set(user_profile.icon, icon);
            if (blog)query.set(user_profile.blog, blog);
            if (desc)query.set(user_profile.desc, desc);
            if (gender)query.set(user_profile.gender, gender);
            if (birth) query.set(user_profile.birth, birth);
            if (location)query.set(user_profile.location, location);
            if (job)query.set(user_profile.job, job);
            if (company)query.set(user_profile.company, company);

            sql = query.toString();
            pool.execute(sql, function (err, rows) {
                if (err) {
                    cb(err, null);
                    return;
                }
                exports.getUserProfile(uid, function (err, userProfile) {
                    cb(err, userProfile);
                });
            });
        }
    });
}