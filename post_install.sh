#!/bin/bash
npm install grunt-contrib-jshint grunt-jscs grunt-mongo-drop grunt-simple-mocha grunt-contrib-clean grunt-contrib-copy grunt-contrib-sass grunt-browserify grunt-express-server grunt-contrib-watch
./node_modules/bower/bin/bower install
./node_modules/grunt-cli/bin/grunt build