'use strict';

process.env.MONGO_URL = 'mongodb://localhost/flybox_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('User Creation and Authentication', function() {
  var randUser = 'ImRandom';
  var jwtToken;

  it('should create a user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'fake@email.com', password: 'foobar'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      jwtToken = res.body.jwt;
      done();
    });
  });

  it('should not create a duplicate user', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/users')
    .send({email: 'fake@email.com', password: 'foobar'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(500);
      done();
    });
  });

  it('should log in an existing user', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/users')
    .auth('fake@email.com', 'foobar')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('jwt');
      expect(res.body.jwt).to.eql(jwtToken);
      done();
    });
  });

  it('should not log in fake user', function(done) {
    chai.request('http://localhost:3000')
    .get('/api/users')
    .auth('imnotreal', 'sofake')
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.have.status(500);
      done();
    });
  });

  it('should be able to add SMTP info', function(done) {
    chai.request('http://localhost:3000')
    .post('/api/userSMTP')
    .set({jwt:jwtToken})
    .send({
      host: 'smtp.gmail.com',
      port: '465',
      secure: true,
      username: 'mark@mark.com',
      password: 'password'
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
});
