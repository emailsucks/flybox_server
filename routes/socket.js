'use strict';

var Box = require('../models/box');

module.exports = function(socket) {
  var name = '';

  socket.emit('init', {
    name: 'user',
    users: ['user1', 'user2']
  });

  socket.on('send:post', function(data) {
    Box.findOne({boxKey: data.boxKey}, function(err, current) {
      if (err) {
        console.log(err);
      }
      var newPost = {};
      current.recipients.forEach(function(recipient) { //TODO: add catch for creator post
        if (recipient.urlKey === data.userId) {
          newPost.author = recipient.email;
          name = recipient.email;
        }
      });
      newPost.text = data.message;
      newPost.time = Date.now();
      current.thread.push(newPost);
      current.save();
    });

    socket.broadcast.emit('send:post', {
      text: data.message,
      author: name,
      time: Date.now()
    });
  });
};
