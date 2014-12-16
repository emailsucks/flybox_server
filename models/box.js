'use strict';

var mongoose = require('mongoose');

var boxSchema = mongoose.Schema({
  creator: {email: String, urlKey: String, read: Boolean, userid: String },
  recipients: [{email: String, urlKey: String, read: Boolean}],
  subject: String,
  date: {type: Date, default: Date.now},
  thread: []
});

module.exports = mongoose.model('Box', boxSchema);
