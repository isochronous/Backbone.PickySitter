/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-rigger');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '// Backbone.PickySitter, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Jeremy McLeod, Isochronous.org\n' +
        '// Distributed under MIT license\n' +
        '// Heavily, heavily based on Backbone.Picky by Derick Bailey' +
        '// http://github.com/derickbailey/backbone.picky'
    },

    lint: {
      files: ['src/backbone.pickysitter.js']
    },

    rig: {
      build: {
        src: ['<banner:meta.banner>', 'src/backbone.pickysitter.js'],
        dest: 'lib/backbone.pickysitter.js'
      },
      amd: {
        src: ['<banner:meta.banner>', 'src/amd.js'],
        dest: 'lib/amd/backbone.pickysitter.js'
      }
    },

    min: {
      standard: {
        src: ['<banner:meta.banner>', '<config:rig.build.dest>'],
        dest: 'lib/backbone.pickysitter.min.js'
      },
      amd: {
        src: ['<banner:meta.banner>', '<config:rig.amd.dest>'],
        dest: 'lib/amd/backbone.pickysitter.min.js'
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true,
        Backbone: true,
        _: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint rig min');

};
