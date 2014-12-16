'use strict';

var Box = require('../models/box');

module.exports = function(app, jwtAuth) {
  app.get('/api/boxes', function(req, res) {
    Box.find({}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('Cannot retrieve thread');
      }
      console.log('success');
      res.send({'msg': 'Success'});
//      res.json(data);
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
