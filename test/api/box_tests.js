'use strict';

process.env.MONGO_URL = 'mongodb://localhost/flybox_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;
var appUrl = 'http://localhost:3000';

describe('box routes', function() {
  var jwtToken;

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
    chai.request(appUrl)
    .post('/api/mailHook')
    .send({mailinMsg: {
      html: '<h1>this is some html</h1> #to test@example.com #',
      text: 'this is some text',
      subject: 'a subject',
      from: [{address: 'flybox4real@gmail.com', name: 'mr. box'}]
    }})
    .end(function(err, res) {
      expect(err).to.eql(null);
      done();
    });
  });

  it('should get an index of boxes', function(done) {
    chai.request(appUrl)
    .get('/api/boxes')
    .set({jwt: jwtToken})
    .end(function(err, res) {
      expect(err).to.eql(null);
      console.log(res.body);
      expect(Array.isArray(res.body)).to.be.true;
      done();
    });
  });
});
