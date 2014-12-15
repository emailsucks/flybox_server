'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mongo-drop');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');

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

    mongo_drop: {
      test: {
        'uri': 'mongodb://localhost/flybox_test',
      }
    },

    simplemocha: {
      src: ['test/api/user_tests.js', 'test/api/box_tests.js']
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
      dev: {
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
    },

    express: {
      options: {
        output: 'listening'
      },
      dev: {
        options: {
          script: 'server.js'
        }
      }
    },

    watch: {
      sass: {
        files: 'app/sass/*',
        tasks: 'sass:dev'
      },
      express: {
        files: 'server.js',
        tasks: 'express:dev',
        options: {
          spawn: false
        }
      },
      js: {
        files: 'app/**/*.js',
        tasks: 'browserify:dev'
      }
    }
  });

  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', ['jshint', 'jscs', 'mongo_drop', 'simplemocha']);
  grunt.registerTask('build', ['jshint', 'jscs', 'clean:dev', 'copy:dev', 'sass:dev', 'browserify:dev']);
  grunt.registerTask('serve', ['build:dev', 'express:dev', 'watch']);
};
