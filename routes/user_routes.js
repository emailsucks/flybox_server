'use strict';

var User = require('../models/user');

module.exports = function(app, passport, jwtauth) {
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

  app.post('/api/userSMTP', jwtauth, function(req, res) {
    User.findOne({_id: req.user._id}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (user) return res.status(500).send('cannot post smtp');
      user.smtp.host = req.body.smtp.host;
      user.smtp.port = req.body.smtp.port;
      user.smtp.username = req.body.smtp.username;
      user.smtp.password = req.body.smtp.password;
      user.smtp.secure = req.body.smtp.secure;
      user.save(function(err, doc) {
        if (err) res.status(500).json({msg: 'Could not save user SMTP'});
        res.status(202).json(doc);
      });
    });
  });
};
