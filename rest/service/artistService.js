require('../util/stringUtil.js');

var dao = require('../dao/artistDAO.js');

var NotFoundError = require('../error/notFoundError.js');
var BadRequstError = require('../error/badRequestError.js');
var ConflictError = require('../error/conflictError.js');

var Artist = require('../model/artist.js');

exports.getArtist = function(query, cb){
    var id = query.id;
    var email = query.email;
    var persona = query.persona;
    var nick = query.nick;

    if(!id && !email && !persona && !nick) {
        cb(new BadRequstError('Not enough params ' + JSON.stringify(query)),null);
    }

    if(!String.isPostINT(id)){
        cb(new BadRequstError('Invalid artist_id ' + id),null);
    }

    if((email && !email.length) || (persona && !persona.length) || (nick && !nick.length)) {
        cb(new BadRequstError('Empty params ' + JSON.stringify(query)),null);
    }

    dao.getArtist(query, function(err, artist){
        if(err) cb(err, null);
        if(!artist) cb(new NotFoundError('Not found artist ' + JSON.stringify(query)), null);
        cb(null, JSON.stringify(artist));
    });
}

//OR
exports.searchArtist = function(query, cb){
    var email = query.email;
    var persona = query.persona;
    var nick = query.nick;

    if(!email && !persona && !nick) {
        cb(new BadRequstError('Not enough params ' + JSON.stringify(query)),null);
    }

    if((email && !email.length) || (persona && !persona.length) || (nick && !nick.length)) {
        cb(new BadRequstError('Empty params ' + JSON.stringify(query)),null);
    }

    dao.searchArtist(query, function(err, artists){
        if(err) cb(err, null);
        if(!artists) cb(new NotFoundError('Not found artist ' + JSON.stringify(query)), null);
        cb(null, JSON.stringify(artists));
    });
}


exports.createArtist = function(params, cb){
    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;

    if(!email || !persona || !nick) {
        cb(new BadRequstError('Not enough params ' + JSON.stringify(query)),null);
    }

    if((email && !email.length) || (persona && !persona.length) || (nick && !nick.length)) {
        cb(new BadRequstError('Empty params ' + JSON.stringify(query)),null);
    }

    dao.searchArtist(params, function(err, artists){
        if(err) cb(err, null);
        if(artists) {
            var conflictFields = new Array();
            for(var i=0; i<artists.length; i++){
                var artist = artists[i];
                if(artist.email === email){
                    conflictFields.push('email');
                }
                if(artist.persona === persona){
                    conflictFields.push('persona');
                }
                if(artist.nick === nick){
                    conflictFields.push('nick');
                }
            }
            cb(new ConflictError(JSON.stringify(conflictFields)), null)
        }
        dao.createArtist(params, function(err, artist){
            if(err) cb(err, null);
            cb(null, JSON.stringify(artist));
        })
    });
}

exports.updateArtist = function(id, params, cb){
    if(!id || !String.isPostINT(id)){
        cb(new BadRequstError('Invalid artist_id ' + id),null);
    }

    var email = params.email;
    var persona = params.persona;
    var nick = params.nick;

    if(!email && !persona && !nick) {
        cb(new BadRequstError('Not enough params ' + JSON.stringify(query)),null);
    }

    if((email && !email.length) || (persona && !persona.length) || (nick && !nick.length)) {
        cb(new BadRequstError('Empty params ' + JSON.stringify(query)),null);
    }

    var query = new Object();
    query.id = id;
    dao.getArtist(query, function(err, artist){
        if(err) cb(err, null);
        if(!artist) cb(new NotFoundError('Not found artist ' + JSON.stringify(query)), null);
        dao.updateArtist(id, params, function(err, artist){
            if(err) cb(err, null);
            cb(null, JSON.stringify(artist));
        })
    });
}