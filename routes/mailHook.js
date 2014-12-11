'use strict';
var nodemailer = require('nodemailer');
var util = require('util');
var multiparty = require('multiparty');
module.exports = function(app) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'marksworld@gmail.com',
      pass: ''
    }
  });

  var mailOptions = {
    from: 'Fred Foo, <foo@blurdybloop.com>', // sender address
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
      console.log(util.inspect({fields: fields.mailinMsg, files: files}));
      console.log(jsonParsed.from[0].address);

      mailOptions.to = jsonParsed.from[0].address;
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
        }
      });

    });
  });
};
