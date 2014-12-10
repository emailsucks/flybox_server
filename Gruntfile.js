'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: ['Gruntfile.js', 'server.js']
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      src: ['Gruntfile.js', 'server.js']
    }
  });
  grunt.registerTask('test', ['jshint', 'jscs']);
};
