'use strict';

var User = require('../models/user');

module.exports = function(app, passport, jwtAuth) {
  app.get('/api/users', passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
  });

  app.post('/api/users', function(req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (user) return res.status(500).send('cannot create that user');
      var newUser = new User();
      newUser.email = req.body.email;
      newUser.password = newUser.generateHash(req.body.password);
      newUser.save(function(err, data) {
        if (err) return res.status(500).send('server error');
        res.json({jwt: newUser.generateToken(app.get('jwtSecret'))});
      });
    });
  });

  app.post('/api/userTest', jwtAuth, function(req, res) {
    res.json(req.body);
  });


  app.post('/api/userSMTP', jwtAuth, function(req, res) {
    var userObject = {
      smtp: {
        host: req.body.host,
        port: req.body.port,
        username: req.body.username,
        password: req.body.password,
        secure: req.body.secure
      }
    };
    User.findOneAndUpdate({_id: req.user._id}, userObject, function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).send('server error');
      }
      if (user === null) return res.status(500).send('cannot post smtp');
      res.status(202).json(user.smtp);
    });
  });
};
