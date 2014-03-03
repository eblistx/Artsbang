var config = require('./config.js');
var http = require('http');
var qs = require('querystring');
var rs = require('randomstring');
var extend = require('node.extend');

exports.createUserAccount = function (test) {
    test.expect(4);

    /*
     {
     "email":"davidjiang@ea.com",
     "persona":"davidjiang",
     "nick":"davidjiang",
     "role":1,
     "regSource":"sina",
     "pwd":"1234"
     }
     */
    var str = rs.generate(10);
    var postData = {};
    postData.email = str + '@ea.com';
    postData.persona = str;
    postData.nick = str;
    postData.role = 1;
    postData.regSource = 'test';
    postData.pwd = 'Welcome123';

    var content = JSON.stringify(postData);

    var options = extend(true, config, {
        path: '/1/users',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': content.length
        }
    });

    console.log("post options:\n", options);
    console.log("content:", content);

    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);

        test.equal(res.statusCode, 200, 'statusCode');
        //test.done();

        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            var data = JSON.parse(chunk);
            test.equal(data.email, postData.email, 'email');
            test.equal(data.persona, postData.persona, 'persona');
            test.equal(data.nick, postData.nick, 'nick');
            test.done();
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        test.done();
    });

    req.write(content);
    req.end();
}