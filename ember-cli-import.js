var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var sh = require('shelljs');

var NO_NPM_MSG = '`CliImport.npm` is still under construction. Please remove the your usage of it';

// ================================================================================
// Export
// ================================================================================

module.exports = CliImport;

// ================================================================================
// Constructor
// ================================================================================

function CliImport(app) {
  if (_.isUndefined(app)) throw new Error('`app` must be passed to constructor');

  this.app = app;
  this._bower = getBowerDir(app);
  this._npm = getNpmDir(app);
  this._vendor = 'vendor';
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
  this.dep(this._bower + ensureSlash(dep), options);
};

CliImport.prototype.bowerDevProd = function(dep, options) {
  this.depDevProd(this._bower + ensureSlash(dep), options);
};

CliImport.prototype.bowerFont = function(font, options) {
  var extensions = ['eot', 'svg', 'ttf', 'woff', 'woff2'];

  _.forEach(extensions, _.bind(function(extension) {
    try {
      fs.accessSync(this._bower + ensureSlash(font) + '.' + extension, fs.R_OK)
      this.bower(font + '.' + extension, options);
    } catch(err) {
      if (err.code === 'EACCES') throw(new Error(err.path + ' found but unable to access can not import'));
    }
  }, this));
};

// ================================================================================
// npm shortcuts
// ================================================================================

CliImport.prototype.npm = function(dep, options) {
  var depPath, vendorPathFile, vendorPathDir;

  dep = ensureSlash(dep);
  depPath = path.join(process.cwd(), this._npm, dep);
  vendorPathFile = path.join('.', this._vendor, dep);
  vendorPathDir = vendorPathFile.substring(0, vendorPathFile.lastIndexOf('/'));

  // Link the desired node_module to a place in the broccoli tree
  sh.mkdir('-p', vendorPathDir);
  sh.ln('-sf', depPath, vendorPathFile);

  this.dep(vendorPathFile, options);
};

CliImport.prototype.npmDevProd = function(dep, options) {
  return console.error(NO_NPM_MSG);
  // this.depDevProd(this._npm + ensureSlash(dep), options);
};

// ================================================================================
// Utility methods
// ================================================================================

function ensureSlash(dep) {
  if (!_.startsWith(dep, '/')) dep = '/' + dep;
  return dep;
}

function removePathToDir(path) {
  if (_.isString(path)) return;

  path = _.trimEnd(path, ' /');
  path = path.slice(path.lastIndexOf('/') + 1);

  if (_.isEmpty(path)) return;

  return path;
}

function getNpmDir(app) {
  var npmDirectory;

  // Priority 1, there aren't many other reliable places to look
  npmDirectory = removePathToDir(_.get(app, 'project.nodeModulesPath'));
  if (_.isString(npmDirectory)) return npmDirectory;

  // Priority 2, fail safe default
  return 'node_modules';
}

function getBowerDir(app) {
  var bowerDirectory;

  // Priority 1, for consistency with `node_modules` lookup
  bowerDirectory = _.get(app, 'project.bowerDirectory');
  if (_.isString(bowerDirectory)) return bowerDirectory;

  // Priority 2, despite being the ember-cli approved namespace
  bowerDirectory = _.get(app, 'bowerDirectory');
  if (_.isString(bowerDirectory)) return bowerDirectory;

  // Priority 3, fail safe default
  return 'bower_components';
}
