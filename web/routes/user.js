exports.profile = function(req, res){
  res.render('user/profile', {"user":{"persona":"david"}});
};

exports.artistlist = function(req, res){
    res.render('user/artistlist', {"user":{"persona":"david"}});
};