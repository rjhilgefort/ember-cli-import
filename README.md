ember-cli-import
================

## Installation

You can simply install this package via npm. TODO: Better install instructions.

## Usage

Below is a sample `ember-cli-build.js` file. This project still needs to be commented better, but for additional methods, please [check out the source](ember-cli-import.js).

```js
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var CliImport = require('ember-cli-import');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  // Create an instance of this project with the ember app instance
  var cliImport = new CliImport(app);

  // Example icons import
  cliImport.bower('/some-icons-package/css/some-icons-package.css');
  cliImport.bowerFont('/some-icons-package/font/some-icons-package-regular-webfont',  { destDir: 'font' })

  // Simple example of including a bower component
  cliImport.bower('/some-bower-package/package.js');

  // Simple example of including both 'development' and 'production' versions of a bower component
  cliImport.bowerDevProd('/another-bower-package/dist/another-bower-package.js');

  return app.toTree();
};
```
