/* eslint-disable import/no-unresolved */
/* eslint-disable-next-line import/no-extraneous-dependencies */
const fs = require('fs-extra');
const path = require('path');
const WriteFilePlugin = require('write-file-webpack-plugin');

const rewireBabelLoader = require('react-app-rewire-babel-loader');
const rewireYarnWorkspaces = require('react-app-rewire-yarn-workspaces');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => {
    return path.resolve(appDirectory, relativePath);
};

const CSPhtmlWebpackPlugin = require('csp-html-webpack-plugin');

const cspConfigPolicy = {
    'default-src': "'none'",
    'base-uri': "'self'",
    'object-src': "'none'",
    'script-src': ["'self'"],
    'manifest-src': ["'self'"],
    'img-src': ["'self'"],
    'style-src': ["'self'"],
};

module.exports = function override(config, env) {
    /**
     *   Force the dev server to write hot reloading changes to disk,
     *   so that browser can serve them.
     *   Related: https://github.com/facebook/create-react-app/issues/1070
     *            https://github.com/gajus/write-file-webpack-plugin
     */

    const buildPath = './build';

    config.output.path = path.join(__dirname, buildPath);
    config.plugins.push(new WriteFilePlugin());
    config.output.futureEmitAssets = false;
    fs.removeSync(buildPath);
    fs.copySync('./public/', buildPath);

    /**
     *  Content Security Policy (CSP) in Create-React-App (CRA)
     *  Related: https://medium.com/@nrshahri/csp-cra-324dd83fe5ff
     */

    if (process.env.NODE_ENV === 'production') {
        config.plugins.push(new CSPhtmlWebpackPlugin(cspConfigPolicy));
    }

    // Monorepo code sharing
    const newConfig = rewireBabelLoader.include(
        config,
        // our packages that will now be included in the CRA build step
        resolveApp('src'),
        resolveApp('../web/components')
    );
    return rewireYarnWorkspaces(newConfig, env);
};
