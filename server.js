'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bp = require('body-parser');
var app = express();
app.use(bp.json());

app.use(express.static(__dirname + '/build'));

var port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGOLAB_URI ||
                process.env.MONGOHQ_URL ||
                'mongodb://localhost/notes_development');

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});
