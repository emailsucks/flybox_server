'use strict';

var Box = require('../models/box');

module.exports = function(socket) {
  var name = '';

  socket.on('init', function(data){
    socket.box = data.box;
    socket.key = data.key;
    socket.join(data.box);
  });

  socket.on('send:post', function(data) {
    Box.findOne({boxKey: data.boxKey}, function(err, current) {
      if (err) {
        console.log(err);
      }
      var newPost = {};
      if (!current.recipients) {
        return;
      }
      current.recipients.forEach(function(recipient) {
        recipient.read = false;
        if (recipient.urlKey === data.userId) {
          newPost.author = recipient.email;
          name = recipient.email;
          recipient.read = true;
        }
      });
      newPost.text = data.message;
      newPost.time = Date.now();
      current.thread.push(newPost);
      current.save();
      socket.broadcast.to(socket.box).emit('send:post', {
        text: data.message,
        author: name,
        time: Date.now()
      });
    });
  });
};
