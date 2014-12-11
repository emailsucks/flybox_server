'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browserify');

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
    },

    clean: {
      dev: {
        src: ['build/']
      }
    },

    copy: {
      dev: {
        cwd: 'app/',
        expand: true,
        src: ['**/*.html', '**/*.css'],
        dest: 'build/'
      }
    },

    sass: {
      dist: {
        files: {
          'build/main.css': 'app/sass/main.sass'
        }
      }
    },

    browserify: {
      dev: {
        src: ['app/js/**/*.js'],
        dest: 'build/client_bundle.js',
        options: {
          transform: ['debowerify']
        }
      }
    }
  });

  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', ['jshint', 'jscs']);
  grunt.registerTask('build', ['jshint', 'jscs', 'clean:dev', 'copy:dev', 'sass', 'browserify:dev']);
};
