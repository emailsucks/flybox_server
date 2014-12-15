'use strict';
var nodemailer = require('nodemailer');
var util = require('util');
var multiparty = require('multiparty');
module.exports = function(app) {
  var userOptions = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'marksworld@gmail.com',
      pass: process.env.mailpass
    }
  };
  var transporter = nodemailer.createTransport(smtpTransport(userOptions));

  var mailOptions = {
    from: 'Mark Harrell, <marksworld@gmail.com>', // sender address
    to: '', // list of receivers
    subject: 'Hello', // Subject line
    text: 'Hello world', // plaintext body
    html: '<b>Hello world</b>' // html body
  };

  app.post('/api/mailHook', function(req, res) {
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
      var parsedEmails = jsonParsed.text.match(/#to(.*?)#/i)[1].split(' ').filter(Boolean);
      var random = '';
      for (var i = 0; i < parsedEmails.length; i++) {
        random = Math.floor((Math.random() * 100000) + 1);
        mailOptions.to = parsedEmails[i];
        mailOptions.text = 'Hello world and some random numbers: ' + random;
        mailOptions.html = '<b>Hello world and some random text: </b> ' + random;
        transporter.sendMail(mailOptions, emailCallback);
      }
    });
  });

  app.get('/api/mailHook', function(req, res) {
    res.status(200).send('works!');
  });
};
