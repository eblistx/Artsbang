function ContestRelationship(db){
    this.rid = db.RELATIONSHIP_ID;
    this.cid = db.CONTEST_ID;
    this.fid = db.FOLLOWER_ID;
}

module.exports = ContestRelationship;