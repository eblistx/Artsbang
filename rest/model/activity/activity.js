function Activity(db){
    this.aid = db.ACTIVITY_ID;
    this.uid = db.USER_ID;
    this.type = db.TYPE;
    this.content = db.CONTENT;
}

module.exports = Activity;