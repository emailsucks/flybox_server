'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bp = require('body-parser');
var passport = require('passport');
var socket = require('./routes/socket');

var app = express();
app.use(express.static(__dirname + '/build'));
app.use(bp.json());
app.use(passport.initialize());

var port = process.env.PORT || 3000;
app.set('jwtSecret', process.env.JWT_SECRET || 'changethis');
app.set('secret', process.env.SECRET || 'changethis');
mongoose.connect(process.env.MONGO_URL ||
                process.env.MONGOLAB_URI ||
                process.env.MONGOHQ_URL ||
                'mongodb://localhost/flybox_test');

require('./lib/passport')(passport);
var jwtAuth = require('./lib/jwt_auth')(app.get('jwtSecret'));
require('./routes/user_routes')(app, passport, jwtAuth);
require('./routes/mailHook')(app);
require('./routes/box_routes')(app, jwtAuth);

var server = require('http').Server(app);
var io = require('socket.io')(server);
io.sockets.on('connection', socket);

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});
