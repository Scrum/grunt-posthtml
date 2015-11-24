/*
 * grunt-posthtml
 * https://github.com/TCotton/grunt-posthtml
 *
 * Copyright (c) 2015 Andy Walpole
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var posthtml = require('posthtml');
var diff = require('diff');
var chalk = require('chalk');

/**
 * creates absolute path
 * @param file {string}
 * @returns {*}
 */
function absolutePath(file) {
  return path.join(process.cwd(), file);
}

/**
 * @param {string} msg Log message
 */
function log(msg) {
  grunt.verbose.writeln(msg);
}

function posthtmlFun(plugins, html, options) {

 /* console.log('plugins');
  console.dir(plugins);
  console.log('html');
  console.dir(html);
  console.log('options');
  console.dir(options);*/

  posthtml()
    .use(plugins)
    .process(html, options)
    .then(function(result) {
      console.dir(result.html);
    });
}

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('posthtml', 'PostHMTL Grunt Plugin', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      use: [],
      process: '',
      parse: '',
      singleTags: [],
      closingSingleTag: '',
      skipParse: null,
      sync: null
    });

    var plugins = options.use[0].length > 0 ? options.use[0] : null;
    delete options.use;

    /*  // checks that a dest folder has been set, if not it will create a warning message
     if (options.dest.length === 0) {
     grunt.fail.warn('PostHTML: you must set a destination directory in the options: dest: \'directory\'');
     }

     // check for existence of destination directory
     // if it doesn't exist, create it
     if (!grunt.file.isDir(absolutePath(options.dest)) && options.dest.length > 0) {
     grunt.file.mkdir(absolutePath(options.dest));
     }
     */
    this.files.forEach(function(file) {

      if (!Array.isArray(file.orig.src)) {
        return false;
      }

      var filePath = file.orig.src[0].cwd;
      var destination = absolutePath(file.orig.src[0].dest);

      // Concat specified files.
      file.orig.src[0].src.filter(function(filepath) {

        var file = absolutePath(filePath) + filepath;
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(file)) {
          grunt.log.warn('Source file "' + file + '" not found.');
          return false;
        } else {
          posthtmlFun(plugins, grunt.file.read(file), options);
        }
      });

    });

    // Iterate over all specified file groups.
    /* this.src.forEach(function(file) {

     console.dir(file);*/

    //console.dir(f);

    /* // Concat specified files.
     var src = f.src.filter(function(filepath) {
     // Warn on and remove invalid source files (if nonull was set).
     if (!grunt.file.exists(filepath)) {
     grunt.log.warn('Source file "' + filepath + '" not found.');
     return false;
     } else {
     return true;
     }
     }).map(function(filepath) {
     // Read file source.
     return grunt.file.read(filepath);
     }).join(grunt.util.normalizelf(options.separator));

     // Handle options.
     src += options.punctuation;

     // Write the destination file.
     grunt.file.write(f.dest, src);

     // Print a success message.*/
    /*  grunt.log.writeln('File "' + f.dest + '" created.');
     });*/
  });

};
