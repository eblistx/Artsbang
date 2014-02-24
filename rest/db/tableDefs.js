var sqlHelper = require('./sqlHelper.js');

var tableDefs = {};

tableDefs.user_password = sqlHelper.tableDefine({
    name: "artsbang.user_password",
    columns: ["user_id", "password"]
});

tableDefs.user_account = sqlHelper.tableDefine({
    name: "artsbang.user_account",
    columns: ["user_id", "email", "persona", "nick", "role", "status", "registration_source", "email_status"]
});

tableDefs.user_profile = sqlHelper.tableDefine({
    name: "artsbang.user_profile",
    columns: ["user_id", "icon", "blog", "desc", "gender", "location", "job", "company", "verify"]
});

module.exports = tableDefs;