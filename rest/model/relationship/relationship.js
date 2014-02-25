function Relationship(db){
    this.rid = db.RELATIONSHIP_ID;
    this.lid = db.LEADER_ID;
    this.fid = db.FOLLOWER_ID;
}

module.exports = Relationship;