Package.describe({
  name: 'method',
  summary: '',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript',
    'check',
    'ddp',
    'underscore',
    'aldeed:simple-schema'
  ]);
  api.addFiles('methods.js');
  api.export('Method');
});

// Package.onTest(function(api) {
//   api.use('ecmascript');
//   api.use('tinytest');
//   api.use('methods');
//   api.addFiles('methods-tests.js');
// });