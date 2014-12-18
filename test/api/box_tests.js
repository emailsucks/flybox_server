'use strict';

process.env.MONGO_URL = 'mongodb://localhost/flybox_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');
var FormData = require('form-data');
var expect = chai.expect;
var appUrl = 'http://localhost:3000';
var request = require('request');
var util = require('util');


describe('box routes', function() {
  var jwtToken;
  var boxkey;
  var userkey;
  var recipientKey;

  before(function(done) {
    chai.request(appUrl)
    .post('/api/users')
    .send({email: 'flybox4real@gmail.com', password: 'flyboxme'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      jwtToken = res.body.jwt;
      done();
    });
  });

  before(function(done) {
    chai.request(appUrl)
    .post('/api/userSMTP')
    .set({jwt: jwtToken})
    .send({
      host: 'smtp.gmail.com',
      port: '465',
      secure: true,
      username: 'flybox4real@gmail.com',
      password: 'flyboxme'
    })
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(202);
      expect(res.body).to.have.property('host');
      expect(res.body).to.have.property('port');
      expect(res.body).to.have.property('secure');
      expect(res.body).to.have.property('username');
      expect(res.body).to.have.property('password');
      done();
    });
  });

  it('should make a box through mailHook', function(done) {
    var form = new FormData();
    var finalizedMessage = {
        html: '<h1>this is some html</h1> #to test@example.com #',
        text: '#to test@example.com test1@example.com flybox4real@gmail.com #',
        subject: 'a subject',
        from: [{address: 'flybox4real@gmail.com', name: 'mr. box'}]
    };

    form.append('mailinMsg', JSON.stringify(finalizedMessage));

    form.getLength(function(err, length) {

      var headers = form.getHeaders();
      headers['Content-Length'] = length;

      var r = request.post({
        url: appUrl + '/api/mailHook/',
        timeout: 30000,
        headers: headers
      }, function(err, resp, body) {
        var jsonParsed = JSON.parse(resp.body);
        if (err || resp.statusCode !== 200) {
          return console.log('error posting to webhook ' + err || resp);
        }
        expect(resp.statusCode).to.eql(200);
        expect(jsonParsed.subject).to.eql('a subject');
        done();
      });
      r._form = form;
    });
  });

  it('should get an index of boxes for a user', function(done) {
    chai.request(appUrl)
    .get('/api/boxes')
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.be.true;
      boxkey = res.body[0].boxKey;
      recipientKey = res.body[0].recipients[0].urlKey;
      done();
    });
  });

  it('should get a single box', function(done) {
    chai.request(appUrl)
    .get('/api/n/' + boxkey + '/' + recipientKey)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('boxKey');
      done();
    });
  });

  it('should post to a box as a non-user', function(done) {
    chai.request(appUrl)
    .post('/api/n/' + boxkey + '/' + recipientKey)
    .send({text: 'hello there'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      done();
    });
  });
});
