function Artist(artistdb){
    this.id = artistdb.ARTIST_ID;
    this.email = artistdb.EMAIL;
    this.persona = artistdb.PERSONA;
    this.nick = artistdb.NICK;
}

module.exports = Artist;