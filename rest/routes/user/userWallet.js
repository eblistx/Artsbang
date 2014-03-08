var userWalletService = require('../../service/user/userWalletService');
var BadRequestError = require('../../error/badRequestError');

/*
 get user_wallet

 input:
 params
 user_id

 output:
 user_wallet
 */
exports.getUserWallet = function(req, res, next){
    req.assert('uid', 'invalid user_id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        next(new BadRequestError(JSON.stringify(errors)));
        return;
    }

    userWalletService.getUserWallet(req.params.uid, function(err, userWallet){
        if(err) next(err);
        res.end(userWallet);
    });
};
