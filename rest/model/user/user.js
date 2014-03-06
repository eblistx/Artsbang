function User(userdb){
    this.uid = userdb.USER_ID;
    this.email = userdb.EMAIL;
    this.persona = userdb.PERSONA;
    this.homepage = userdb.HOMEPAGE;
    this.role = userdb.ROLE;
}

module.exports = User;