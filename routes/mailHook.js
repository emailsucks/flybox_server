'use strict';
var nodemailer = require('nodemailer');
var util = require('util');
var multiparty = require('multiparty');
var User = require('../models/user');
var Box = require('../models/box');

module.exports = function(app) {

  app.post('/api/mailHook', function(req, res) {
    var userOptions = {
      host: '',
      port: 25,
      secure: true,
      auth: {
        user: '',
        pass: ''
      }
    };

    var mailOptions = {
      from: '', // sender address
      to: '', // list of receivers
      subject: 'Hello', // Subject line
      text: 'Hello world', // plaintext body
      html: '<b>Hello world</b>' // html body
    };

    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      res.set('Content-Type', 'text/plain');
      res.status(200);
      var jsonParsed = JSON.parse(fields.mailinMsg);
      res.end(util.inspect({fields: fields.mailinMsg, files: files}));
      console.log(jsonParsed);
      var emailCallback = function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
        }
      };

      var userEmail = jsonParsed.from[0].address;
      var parsedEmails = jsonParsed.text.match(/#to(.*?)#/i)[1].split(' ').filter(Boolean);
      User.findOne({ 'email': userEmail }, function(err, data) {
        console.log(userEmail);
        if (err) console.log(err);
        if (data === null) console.log('data is null');
        else {
          userOptions.host = data.smtp.host;
          userOptions.port = data.smtp.port;
          userOptions.auth.user = data.smtp.username;
          userOptions.auth.pass = data.smtp.password;
          userOptions.secure = data.smtp.secure;
          var random = '';
          var newBox = new Box();
          newBox.creator.id = data._id;
          newBox.creator.email = userEmail;
          newBox.creator.read = true;
          /* loop through the parsed emails and send out
          the email with the created box link.
          */
          for (var i = 0; i < parsedEmails.length; i++) {
            mailOptions.to = parsedEmails[i];
            mailOptions.from = userEmail;
            mailOptions.text = 'Hello world and some random numbers: ';
            mailOptions.html = '<b>Hello world and some random text: </b> ';
          }
          var transporter = nodemailer.createTransport(userOptions);
          transporter.sendMail(mailOptions, emailCallback);
        }
      });
    });
  });

  app.get('/api/mailHook', function(req, res) {
    res.status(200).send('works!');
  });
};
