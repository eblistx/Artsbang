var moment = require('moment');

function Activity(db){
    this.aid = db.ACTIVITY_ID;
    this.uid = db.USER_ID;
    this.type = db.TYPE;
    this.content = db.CONTENT;
    this.modifyTime = moment(db.MODIFY_TIME).format('YYYY-MM-DD HH:MM:SS');
}

module.exports = Activity;