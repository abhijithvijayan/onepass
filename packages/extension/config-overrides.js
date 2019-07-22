/* eslint-disable import/no-unresolved */
const path = require('path');
/* eslint-disable-next-line import/no-extraneous-dependencies */
const fs = require('fs-extra');
const WriteFilePlugin = require('write-file-webpack-plugin');
const CSPhtmlWebpackPlugin = require('csp-html-webpack-plugin');
const rewireBabelLoader = require('react-app-rewire-babel-loader');
const rewireYarnWorkspaces = require('react-app-rewire-yarn-workspaces');

/**
 *  Content Security Policy
 */

// Development
const cspConfigDevPolicy = {
    'script-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
    'style-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
};

const cspDevOptions = {
    enabled: true,
    hashingMethod: 'sha256',
    hashEnabled: {
        'script-src': false,
        'style-src': false,
    },
    nonceEnabled: {
        'script-src': true,
        'style-src': false,
    },
};

// Production
const cspConfigProdPolicy = {
    'default-src': "'none'",
    'base-uri': "'self'",
    'object-src': "'none'",
    'script-src': ["'self'"],
    'manifest-src': ["'self'"],
    'img-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"],
};

/** Relative PATH for the files */
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => {
    return path.resolve(appDirectory, relativePath);
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
     *           https://github.com/slackhq/csp-html-webpack-plugin
     */

    if (process.env.NODE_ENV === 'production') {
        config.plugins.push(new CSPhtmlWebpackPlugin(cspConfigProdPolicy));
    }
    // else {
    //     // ToDo: Refactor needed
    //     config.plugins.push(new CSPhtmlWebpackPlugin(cspConfigDevPolicy, cspDevOptions));
    // }

    // Monorepo code sharing
    const newConfig = rewireBabelLoader.include(
        config,
        // our packages that will now be included in the CRA build step
        resolveApp('src'),
        resolveApp('../core'),
        resolveApp('../web/api'),
        resolveApp('../web/components'),
        resolveApp('../web/state')
    );
    return rewireYarnWorkspaces(newConfig, env);
};
