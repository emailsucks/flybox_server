'use strict';

module.exports = function(app) {
  require('./controllers/users_controller')(app)
};