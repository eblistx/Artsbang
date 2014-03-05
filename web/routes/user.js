exports.profile = function(req, res){
  res.render('user/profile', {"user":{"persona":"david"}});
};