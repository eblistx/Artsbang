function UserWallet(db){
    this.uid = db.USER_ID;
    this.point1 = db.POINT1;
    this.point2 = db.POINT2;
    this.point3 = db.POINT3;
    this.point4 = db.POINT4;
    this.point5 = db.POINT5;
}

module.exports = UserWallet;