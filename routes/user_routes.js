'use strict';

var User = require('../models/user');

module.exports = function(app, passport) {
  app.get('/api/users', passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({jwt: req.user.generateToken(app.get('jwtSecret'))});
  });

  app.post('/api/users', function(req, res) {
    User.findOne({'email': req.body.email}, function(err, user) {
      if (err) return res.status(500).send('server error');
      if (user) return res.status(500).send('cannot create that user');

      var newUser = new User();
      newUser.email = req.body.email;
      newUser.password = newUser.generateHash(req.body.password);
      newUser.smtp.host = req.body.smtp.host;
      newUser.smtp.port = req.body.smtp.port;
      newUser.smtp.username = req.body.smtp.username;
      newUser.smtp.password = req.body.smtp.password;
      newUser.smtp.secure = req.body.smtp.secure;
      newUser.save(function(err, data) {
        if (err) return res.status(500).send('server error');
        res.json({jwt: newUser.generateToken(app.get('jwtSecret'))});
      });
    });
  });
};
