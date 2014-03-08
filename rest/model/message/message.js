var moment = require('moment');

function Message(db){
    this.mid = db.MESSAGE_ID;
    this.uid = db.USER_ID;
    this.type = db.TYPE;
    this.content = db.CONTENT;
    this.source = db.SOURCE;
    this.sourceId = db.SOURCE_ID;
    this.modifyTime = moment(db.MODIFY_TIME).format('YYYY-MM-DD HH:mm:ss');
}

module.exports = Message;