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

  // Simple example of including a bower component
  cliImport.bower('/some-bower-package/package.js');

  // Simple example of including both 'development' and 'production' versions of a bower component.
  // This assumes that there is a `*.min.js` in the same directory.
  cliImport.bowerDevProd('/another-bower-package/dist/another-bower-package.js');

  // Example icons import out of bower
  cliImport.bower('/some-icons-package/css/some-icons-package.css');
  cliImport.bowerFont('/some-icons-package/font/some-icons-package-regular-webfont',  { destDir: 'font' })

  // WIP
  // -------------------------------------------------------------------------------------
  // Simple example of including an npm package
  cliImport.npm('/some-npm-module/package.js');

  // Simple example of including both 'development' and 'production' versions of a node module.
  // This assumes that there is a `*.min.js` in the same directory.
  cliImport.npmDevProd('/another-npm-module/dist/another-npm-modeule.js');
  // -------------------------------------------------------------------------------------

  return app.toTree();
};
```

## TODO

- Formally document the methods in this `README`.
- Finish work to allow importing from `node_modules`;
  - https://github.com/ember-cli/ember-cli/issues/1072
  - https://github.com/dfreeman/ember-cli-node-assets
- Remove the need for `bowerDevProd` and `npmDevProd` by merging with `bower` and `npm`. The merged method would inteligently scan for the minified version on the library.
