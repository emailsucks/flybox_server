'use strict';
var nodemailer = require('nodemailer');
var util = require('util');
var multiparty = require('multiparty');
var User = require('../models/user');
var Box = require('../models/box');
var AWS = require('aws-sdk');
var fs = require('fs');
var async = require('async');

module.exports = function(app) {
  //AMAZON S3
  var bucket = process.env.S3_BUCKET;
  var s3Client = new AWS.S3({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET
  });

  function alphaNumUnique() {
    return Math.random().toString(36).split('').filter(function(value, index, self) {
      return self.indexOf(value) === index;
    }).join('').substr(2, 8);
  }

  app.post('/api/mailHook', function(req, res) {
    /*API EXPECTS:
  html: 'all html here'
  text: 'all text from the email'
  subject: 'email subject'
  from[0].address:  'user email address'
  from[0].name: 'user name'
    */
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

    var fileURLS = [];

    var form = new multiparty.Form();
    var destPath = {};
    form.parse(req, function(err, fields, files) {
      var decodedFile;
      res.set('Content-Type', 'text/plain');
      res.status(200);
      var jsonParsed = JSON.parse(fields.mailinMsg);
      res.end(util.inspect({fields: fields.mailinMsg, files: files}));
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
        if (err) console.log(err);
        if (data === null) console.log('data is null');
        else {
          userOptions.host = data.smtp.host;
          userOptions.port = data.smtp.port;
          userOptions.auth.user = data.smtp.username;
          userOptions.auth.pass = data.smtp.password;
          userOptions.secure = data.smtp.secure;
          var random = '';
          /*create a Box using the user parsed info.  TODO: Think OOP. */
          var newBox = new Box();
          newBox.creator = {
            email: userEmail, urlKey: '', read: false, userid: data._id
          };
          newBox.recipients = [];
          newBox.boxKey = alphaNumUnique();
          for (var j = 0; j < parsedEmails.length; j++) {
            newBox.recipients.push({email: parsedEmails[j], urlKey: '', read: false});
            newBox.recipients[j].urlKey = alphaNumUnique();
          }
          newBox.subject = jsonParsed.subject;
          newBox.date = new Date();
          newBox.thread = [];
          newBox.html = jsonParsed.html;
          newBox.text = jsonParsed.text;
          console.log(fileURLS);
          newBox.save(function(err, data) {
            //TODO: make sure to add some error reporting
            console.log('data from saving box: ' + data.boxKey);
            console.log('data from subject: ' + data.subject);
            if (err) return console.log('could not save box');
            if (data === null) return console.log('no box saved');
            /* loop through the parsed emails and send out
            the email with the created box link.
            */
            for (var i = 0; i < parsedEmails.length; i++) {
              mailOptions.to = parsedEmails[i];
              mailOptions.from = userEmail;
              var flyboxURL = 'http://www.flybox.io/n/' + data.boxKey + '/' + data.recipients[i].urlKey;
              mailOptions.text = 'You have a message from ' + userEmail + '.  To view the message visit: ' + flyboxURL;
              mailOptions.html = '<b>To view your new email, <a href="' + flyboxURL + '">Click here</a></b> ';
              var transporter = nodemailer.createTransport(userOptions);
              transporter.sendMail(mailOptions, emailCallback);
            }
            // s3 bucket file upload
            var fileNameArray = [];
            Object.keys(fields).forEach(function(name) {fileNameArray.push(name);});
            async.each(fileNameArray, function(name, callback) {
              if (name !== 'mailinMsg') {
                decodedFile = new Buffer(fields[name][0], 'base64');
                destPath[name] = name;
                s3Client.putObject({
                  Bucket: bucket,
                  Key: data.boxKey + '_' + destPath[name],
                  ACL: 'public-read',
                  Body: decodedFile,
                  ContentLength: decodedFile.length
                }, function(err, aws) {
                  if (err) console.log('s3 error: ' + err);
                  console.log('done', aws);
                  console.log('s3-us-west-2.amazonaws.com/' + bucket + '/' + data.boxKey + '_' + destPath[name]);
                  fileURLS.push('s3-us-west-2.amazonaws.com/' + bucket + '/' + data.boxKey + '_' + destPath[name]);
                  callback();
                });
              }
              else {
                callback();
              }
            }, function(err) {
              if (err) { throw err; }
              else {
                console.log('finished all file uploads');
                // only after the file uploads have completed do we actually send them to the box
                var fileURLSObject = {
                  fileURLS: fileURLS
                };
                Box.findOneAndUpdate({_id: data._id}, fileURLSObject, function(err, box) {
                  if (err) {
                    return console.log('box file upload URL update error: ' + err);
                  }
                  if (box === null) return console.log('cannot update box with fileURLs');
                  console.log(box);
                });
              }
            });
          });
        }
      });
    });
  });

  app.get('/api/mailHook', function(req, res) {
    res.status(200).send('works!');
  });
};
