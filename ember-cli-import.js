var _ = require('lodash');
fs = require('fs');

module.exports = CliImport;

// ================================================================================
// Constructor
// ================================================================================

function CliImport(app) {
  if (_.isUndefined(app)) {
    throw new Error('`app` must be passed to constructor');
  }
  this.app = app;
};


// ================================================================================
// Core methods
// ================================================================================

CliImport.prototype.dep = function(dep, options) {
  this.app.import(dep, options);
};

CliImport.prototype.depDevProd = function(dep, options) {
  var regexp = /\.[^/.]+$/;
  var extension = dep.match(regexp);

  if (!_.isArray(extension)) {
    throw new Error("`dep` is assumed to have an extension (and a '.min' build)");
  }

  // Grab the extension as a string if found
  extension = _.first(extension);

  // Get rid of extension now that we have it
  dep = dep.replace(regexp, '');

  this.app.import({
    development: dep + extension,
    production: dep + '.min' + extension
  });
};

// ================================================================================
// Bower shortcuts
// ================================================================================

CliImport.prototype.bower = function(dep, options) {
  this.dep(this.app.bowerDirectory + ensureSlash(dep), options);
};

CliImport.prototype.bowerDevProd = function(dep, options) {
  this.depDevProd(this.app.bowerDirectory + ensureSlash(dep), options);
};

CliImport.prototype.bowerFont = function(font, options) {
  var extensions = ['eot', 'svg', 'ttf', 'woff', 'woff2'];
  _.forEach(extensions, function(extension) {
    fs.access(font + '.' + extension, fs.R_OK, function(err) {
      if (!err) {
      this.bower(font + '.' + extension, options);
      }
    });
  }, this)
};


// ================================================================================
// Utility methods
// ================================================================================

function ensureSlash(dep) {
  if (!_.startsWith(dep, '/')) dep = '/' + dep;
  return dep;
}
