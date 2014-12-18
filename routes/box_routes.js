'use strict';

var Box = require('../models/box');

module.exports = function(app, jwtAuth) {
  //get all boxes involed in
  app.get('/api/boxes', jwtAuth, function(req, res) {
    Box.find({$or: [{'creator.email': req.user.email}, {'recipients.email': req.user.email}]}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('Cannot retrieve thread');
      }
      res.json(data); //TODO: refine boxes to only necessary data
    });
  });

  //get box from personal url
  app.get('/api/n/:boxkey/:userkey', function(req, res) {
    Box.findOne({boxKey: req.params.boxkey, recipients: {$elemMatch: {urlKey: req.params.userkey}}}, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).send('Cannot retrieve box');
      }
      res.json(data);
    });
  });

  //post to a box thread
  app.post('/api/n/:boxkey/:userkey', function(req, res) {
    Box.findOne({boxKey: req.params.boxkey}, function(err, current) {
      if (err) {
        console.log(err);
        return res.status(500).send('No box');
      }
      var newPost = {};
      current.recipients.forEach(function(recipient) { //TODO: add catch for creator post
        if (recipient.urlKey === req.params.userkey) {
          newPost.author = recipient.email;
        }
      });
      newPost.text = req.body.text;
      newPost.time = Date.now();
      current.thread.push(newPost);
      current.save();
      res.json({msg: 'success'});
    });
  });

  //edit a post in a box thread
  app.put('/api/n/:boxkey/:userkey', function(req, res) {
    Box.findOne({boxKey: req.params.boxkey}, function(err, current) {
      if (err) {
        console.log(err);
        return res.status(500).send('No box');
      }
      var author;
      current.recipients.forEach(function(recipient) { //TODO: redundant code with line 33
        if (recipient.urlKey === req.params.userkey) {
          author = recipient.email;
        }
      });
      var oldPost = current.thread[req.body.index];
      if (oldPost.author !== author) {
        return res.status(403).send('You cannot edit this post');
      }
      oldPost.text = req.body.text;
      current.thread[req.body.postIndex] = oldPost;
      current.save();
    });
  });

  //delete box
  app.delete('/api/n/:boxkey/', jwtAuth, function(req, res) {
    Box.findOne({boxKey: req.params.boxkey}, function(err, current) {
      if (err) {
        console.log(err);
        return res.status(500).send('No box');
      }
      if (req.user.email !== current.creator.email) {
        return res.status(500).send('Cannot delete this box');
      }
      current.remove();
    });
  });
};
