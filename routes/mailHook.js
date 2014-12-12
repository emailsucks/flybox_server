'use strict';
var nodemailer = require('nodemailer');
var util = require('util');
var multiparty = require('multiparty');
module.exports = function(app) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'marksworld@gmail.com',
      pass: process.env.mailpass
    }
  });

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
      for (var i = 0; i < parsedEmails.length; i++) {
        mailOptions.to = parsedEmails[i];
        transporter.sendMail(mailOptions, emailCallback);
      }
    });
  });

  app.get('/api/mailHook', function(req, res) {
    res.status(200).send('works!');
  });
};
