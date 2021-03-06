var sqlHelper = require('./sqlHelper.js');

var tableDefs = {};

tableDefs.user_password = sqlHelper.tableDefine({
    name: "artsbang.user_password",
    columns: ["user_id", "password", "modify_time"]
});

tableDefs.user_account = sqlHelper.tableDefine({
    name: "artsbang.user_account",
    columns: ["user_id", "email", "persona", "homepage", "role", "status", "registration_source", "email_status", "create_time", "modify_time"]
});

tableDefs.user_profile = sqlHelper.tableDefine({
    name: "artsbang.user_profile",
    columns: ["user_id", "icon", "blog", "motto", "desc", "gender", "birth", "location", "job", "company", "verify", "modify_time"]
});

tableDefs.user_wallet = sqlHelper.tableDefine({
    name: "artsbang.user_wallet",
    columns: ["user_id", "point1", "point2", "point3", "point4", "point5", "modify_time"]
});

tableDefs.activity = sqlHelper.tableDefine({
    name: "artsbang.activity",
    columns: ["activity_id", "user_id", "type", "content", "status", "modify_time"]
});

tableDefs.message = sqlHelper.tableDefine({
    name: "artsbang.message",
    columns: ["message_id", "user_id", "type", "content", "source", "source_id", "status", "modify_time"]
});

tableDefs.userRelationship = sqlHelper.tableDefine({
    name: "artsbang.user_relationship",
    columns: ["relationship_id", "leader_id", "follower_id", "status", "modify_time"]
});

tableDefs.contestRelationship = sqlHelper.tableDefine({
    name: "artsbang.contest_relationship",
    columns: ["relationship_id", "contest_id", "follower_id", "status", "modify_time"]
});

module.exports = tableDefs;