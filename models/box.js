'use strict';

var mongoose = requier('mongoose');

var boxSchema = mongoose.Schema({
  creator: {email: String, urlKey: String, read: Boolean},
  recipients: [{email: String, urlKey: String, read: Boolean}],
  subject: String,
  date: {type: Date, default: Date.now},
  thread: [],
  key: String
});

module.exports = mongoose.model('Box', boxSchema);
