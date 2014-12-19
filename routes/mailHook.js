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
    secretAccessKey: process.env.S3_SECRET,
    sslEnabled: false
  });

  function alphaNumUnique() {
    return Math.random().toString(36).split('').filter(function(value, index, self) {
      return self.indexOf(value) === index;
    }).join('').substr(2, 8);
  }

  app.post('/api/mailHook', function(req, res) {
    /*API EXPECTS Multi-part form:
  {
    fields: {
      mailinMsg: {
        html: '',
        subject: '',
        text: '',
        from: [{address: 'sample@sample.com', name: 'Mark Harrell'}],
      }
    }
  }
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
      subject: 'You have a new Flybox Message', // Subject line
      text: 'Hello world', // plaintext body
      html: '<b>Hello world</b>' // html body
    };

    var fileURLS = [];

    var form = new multiparty.Form();
    var destPath = {};
    form.parse(req, function(err, fields, files) {
      var decodedFile;
      var jsonParsed = JSON.parse(fields.mailinMsg);
      res.set('Content-Type', 'text/plain');
      res.status(200);
      res.json(jsonParsed);
      var emailCallback = function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
        }
      };
      var parsedEmails;
      var userEmail = jsonParsed.from[0].address;
      var userName = jsonParsed.from[0].name;
      var lineBreakCleaned = jsonParsed.text.replace(/(\r\n|\n|\r)/gm, '');
      if (/#to(.*?)#/i.test(lineBreakCleaned)) {
        parsedEmails = lineBreakCleaned.match(/#to(.*?)#/i)[1].split(' ').filter(Boolean);
        parsedEmails.push(userEmail);
        User.findOne({ 'email': userEmail }, function(err, data) {
          if (err) console.log(err);
          if (data === null) console.log('data is null');
          else {
            userOptions.host = data.smtp.host;
            userOptions.port = data.smtp.port;
            userOptions.auth.user = data.smtp.username;
            userOptions.auth.pass = data.smtp.password;
            userOptions.secure = data.smtp.secure;
            /*create a Box using the user parsed info.  TODO: Think OOP. */
            var newBox = new Box();
            var creatorBoxKey = alphaNumUnique();
            newBox.creator = {
              email: userEmail, urlKey: creatorBoxKey, read: false, userid: data._id
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
            newBox.html = jsonParsed.html.replace(/#to(.*?)#/, '');
            console.log(jsonParsed.text.replace(/#to(.*?)#/, ''));
            newBox.text = jsonParsed.text.replace(/#to(.*?)#/, '');
            newBox.save(function(err, data) {
              //TODO: make sure to add some error reporting
              if (err) return console.log('could not save box');
              if (data === null) return console.log('no box saved');
              /* loop through the parsed emails and send out
              the email with the created box link.
              */
              for (var i = 0; i < parsedEmails.length; i++) {
                mailOptions.to = parsedEmails[i];
                mailOptions.from = userEmail;
                var flyboxURL = 'http://www.flybox.io/#/n/' + data.boxKey + '/' + data.recipients[i].urlKey;
                mailOptions.text = userName + ' has started a new conversation with you.  To view this conversation: ' + flyboxURL;
                mailOptions.html = '<center>' + userName + ' has started a new conversation with you.<br><b>To view this conversation, <a href="' + flyboxURL + '">Click here</a></b><br><br><br><br><img src="http://www.flybox.io/logo/flybox.png" width="50px" height="18px"><br>This service provided by <a href="www.flybox.io">flybox.io</center> ';
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
                    if (err) return console.log('s3 error: ' + err);
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
                  // only after the file uploads have completed do we actually send them to the box
                  var fileURLSObject = {
                    fileURLS: fileURLS
                  };
                  Box.findOneAndUpdate({_id: data._id}, fileURLSObject, function(err, box) {
                    if (err) {
                      return console.log('box file upload URL update error: ' + err);
                    }
                    if (box === null) return console.log('cannot update box with fileURLs');
                  });
                }
              });
            });
          }
        });
      }
      else {
        User.findOne({ 'email': userEmail }, function(err, data) {
          if (err) console.log(err);
          else if (data === null) console.log('data is null');
          else {
            userOptions.host = data.smtp.host;
            userOptions.port = data.smtp.port;
            userOptions.auth.user = data.smtp.username;
            userOptions.auth.pass = data.smtp.password;
            userOptions.secure = data.smtp.secure;
            mailOptions.to = userEmail;
            mailOptions.from = userEmail;
            mailOptions.subject = 'Flybox had a problem with your msg!';
            mailOptions.text = 'There was an issue with your #to formatting.  Please use #to test1@example.com test2@example.com #';
            mailOptions.html = 'There was an issue with your <b>#to formatting</b>.  Please use #to test1@example.com test2@example.com #';
            var transporter = nodemailer.createTransport(userOptions);
            transporter.sendMail(mailOptions, emailCallback);
          }
        });
      }
    });
  });
};
