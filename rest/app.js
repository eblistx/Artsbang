var express = require('express');
var app = express();

var logUtil = require('./util/logUtil.js');
var logger = logUtil.logger('main');
var log4js = logUtil.log4js();

app.set('port', process.env.PORT || 3000);
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
app.use(app.router);
app.use(function(err, req, res, next) {
    if(!err) return next();
    logger.error(err);
    if(!err.statusCode)err.statusCode = 500;
    res.send(err.message, err.statusCode);
    res.end();
});

//service
var artistService = require('./service/artistService.js');

//artists account
app.get('/1/artists', function (req, res, next) {
    artistService.getArtist(req.query, function (err, artist) {
        if(err) next(err);
        res.end(artist);
    });
});

app.get('/1/artists/:id', function (req, res, next) {
    artistService.getArtist(req.params, function (err, artist) {
        if(err) next(err);
        res.end(artist);
    });
});

app.put('/1/artists/:id', function(req, res, next){
    artistService.updateArtist(req.params.id, req.body, function(err, artist){
        if(err) next(err);
        res.end(artist);
    });
});

app.post('/1/artists', function (req, res, next) {
    artistService.createArtist(req.body, function (err, artist) {
        if(err) next(err);
        res.end(artist);
    });
});

app.post('/1/artists/search', function (req, res, next) {
    artistService.searchArtist(req.body, function (err, artists) {
        if(err) next(err);
        res.end(artists);
    });
});

//artists profile

//artists reputation/point

//artists mission


app.listen(3000);
console.log('Listening on port 3000');
