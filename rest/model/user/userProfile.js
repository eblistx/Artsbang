function UserPofile(db){
    this.uid = db.USER_ID;
    this.icon = db.ICON;
    this.blog = db.BLOG;
    this.desc = db.DESC;
    this.gender = db.GENDER;
    this.location = db.LOCATION;
    this.job = db.JOB;
    this.company = db.COMPANY;
    this.verify = db.VERIFY;
}

module.exports = UserPofile;