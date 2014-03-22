var express = require('express');
var app = express();
var xmlparser = require('express-xml-bodyparser');

var logUtil = require('./util/logUtil');
var logger = logUtil.logger('main');
var log4js = logUtil.log4js();

var domain = require('domain');
app.use(function (req, res, next) {
    var reqDomain = domain.create();
    reqDomain.on('error', function (err) {
        logger.error(err);
        if (!err.statusCode) {
            res.send(500, err.stack);
        } else {
            res.send(err.message, err.statusCode);
        }
        res.end();
    });

    reqDomain.run(next);
});

app.use(xmlparser());
app.use(log4js.connectLogger(logger, {level: log4js.levels.INFO}));
app.use(app.router);

app.use(function (err, req, res, next) {
    if (!err) return next();
    logger.error(err);
    if (!err.statusCode) {
        res.send(500, err.stack);
    } else {
        res.send(err.message, err.statusCode);
    }
    res.end();
});

app.get('/index', function (req, res, next) {
    if (req.query.echostr) {
        logger.trace(req.query);
        res.end(req.query.echostr);
    }else{
        res.end('');
    }
});

app.post('/index', function (req, res, next) {
    logger.trace(req.body);

    var id = req.body.xml.content[0];
    var str;
    if(!isNaN(id)){
        str = '艺瓣网感谢你的投票';
    }else{
        str = '请输入数字进行投票';
    }

    var xml = '<xml>';
    xml +=  '<ToUserName><![CDATA[' + req.body.xml.fromusername[0] + ']]></ToUserName>';
    xml +=  '<FromUserName><![CDATA[' + req.body.xml.tousername[0] + ']]></FromUserName>';
    xml +=  '<CreateTime>' + req.body.xml.createtime[0] + '</CreateTime>';
    xml +=  '<MsgType><![CDATA[text]]></MsgType>';
    xml +=  '<Content><![CDATA[' + str + ']]></Content>';
    xml +=  '<FuncFlag>0</FuncFlag>';
    xml +=  '</xml>';

    logger.trace(xml);
    res.end(xml);
});

app.listen(80);
console.log('Listening on port 80');
