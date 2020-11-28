var authService = require('./AuthService');

exports.register = function(req, res){
    let register = authService.Register(req.query, function(err, result){
    if(err)
        res.send(err);
    res.send(result);
  })
}


exports.login = function(req, res){
   let login = authService.Login(req.query, function(err, result){
       if(err)
          res.send(err)
       res.send(result);
   })
}


exports.validate_token = function(req, res){
    let validate = authService.Validate(req.query.token,function(err, result){
        if(err)
            res.send(err.message);
        res.send(result);
    })
}


exports.get_user_data = function(req, res){
    let validate = authService.getuserData(function(err, result){
        if(err)
            res.send(err.message);
        res.send(result);
    })
}


exports.check_jwt_token = function(req, res){
    let validate = authService.checkjwttokens(req.query, function(err, result){
        if(err)
            res.send(err.message);
        
        res.send(result);
    })
}


