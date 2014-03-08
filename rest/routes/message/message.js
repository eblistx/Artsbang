var messageService = require('../../service/message/messageService');
var BadRequestError = require('../../error/badRequestError');

/*
 get user_messages

 input:
 params
 user_id

 output:
 list of messages
 */
exports.getMessages = function(req, res, next){
    req.assert('uid', 'invalid user_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }
    
    messageService.getUserMessages(req.params.uid, function(err, messages){
        if(err) next(err);
        res.end(messages);
    })
};

/*
 post user_message

 input:
 params
 user_id
 body
 type
 content
 source
 sourceId

 output:
 activity
 */
exports.createMessage = function(req, res, next){
    req.assert('uid', 'invalid user_id').notEmpty().isInt();
    req.checkBody('type', 'invalid type').notEmpty().isInt();
    req.checkBody('content', 'invalid content').notEmpty();
    req.checkBody('source', 'invalid source').notEmpty().isInt();
    req.checkBody('sourceId', 'invalid sourceId').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    var params = {
        type: req.body.type,
        content: req.body.content,
        source: req.body.source,
        sourceId: req.body.sourceId
    }

    messageService.createActivity(req.params.uid, params, function(err, message){
        if(err) next(err);
        res.end(message);
    });
};