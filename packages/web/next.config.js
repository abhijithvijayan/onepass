const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withTM = require('next-transpile-modules');

// Tell webpack to compile the "@onepass/core" package
// https://www.npmjs.com/package/next-transpile-modules
module.exports = withTM({
    transpileModules: ['@onepass/core'],
});

module.exports = withSass(withCSS());
