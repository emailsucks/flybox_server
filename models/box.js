'use strict';

var mongoose = require('mongoose');

var boxSchema = mongoose.Schema({
  html: String,
  text: String,
  boxKey: String,
  creator: {email: String, urlKey: String, read: Boolean, userid: String },
  recipients: [{email: String, urlKey: String, read: Boolean}],
  subject: String,
  date: {type: Date, default: Date.now},
  thread: [],
  fileURLS: []
});

module.exports = mongoose.model('Box', boxSchema);
