'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mongo-drop');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: ['Gruntfile.js', 'server.js', 'app/**/*.js']
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      src: ['Gruntfile.js', 'server.js', 'app/**/*.js']
    },

    mongo_drop: {
      test: {
        uri: 'mongodb://localhost/flybox_test'
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
        src: ['**/*.html',  'logo/**', '**/*.css'],
        dest: 'build/'
      }
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'build/CSS/inbox.css': 'app/sass/inbox.sass',
          'build/CSS/style.css': 'app/sass/style.sass',
          'build/CSS/colors.css': 'app/sass/colors.sass',
          'build/CSS/box.css': 'app/sass/box.sass'
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
      },

      test: {
        src: ['test/client/**/*.js'],
        dest: 'test/angular_testbundle.js',
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
        tasks: 'sass'
      },
      express: {
        files: 'server.js',
        tasks: 'express:dev',
        options: {
          spawn: false
        }
      },
      js: {
        files: ['app/**/*.js', 'app/**/*.html'],
        tasks: 'build'
      }
    },

    karma: {
      unit: {
        configFile: 'karma.config.js'
      },
      continuous: {
        configFile: 'karma.config.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    }

  });
  //trying other tasks

  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', ['jshint', 'jscs', 'mongo_drop', 'simplemocha']);
  grunt.registerTask('test:client', ['jshint', 'jscs', 'mongo_drop', 'build:test', 'karma']);
  grunt.registerTask('build:test', ['jshint', 'jscs', 'clean:dev', 'copy:dev', 'sass', 'browserify:test']);
  grunt.registerTask('build', ['jshint', 'jscs', 'clean:dev', 'copy:dev', 'sass', 'browserify:dev']);
  grunt.registerTask('serve', ['build:dev', 'express:dev', 'watch']);
};
