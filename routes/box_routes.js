'use strict';

var Box = require('../models/box');

module.exports = function(app, jwtAuth) {
  app.get('/api/boxes', jwtAuth, function(req, res) {
    Box.find({$or: [{'creator.email': req.user.email}, {'recipients.email': req.user.email}]}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('Cannot retrieve thread');
      }
      res.json(data);
    });
  });

  app.get('/api/n/:boxkey/:userkey', function(req, res) {
    Box.findOne({boxKey: req.params.boxkey, recipients: {$elemMatch: {userkey: req.params.userkey}}}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('Cannot retrieve box');
      }
      res.json(data);
    });
  });
};
