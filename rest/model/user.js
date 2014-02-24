function User(userdb){
    this.uid = userdb.USER_ID;
    this.email = userdb.EMAIL;
    this.persona = userdb.PERSONA;
    this.nick = userdb.NICK;
    this.role = userdb.ROLE;
}

module.exports = User;