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

/**
    Related: https://github.com/facebook/create-react-app/issues/1070
             https://github.com/gajus/write-file-webpack-plugin
*/

module.exports = function override(config, env) {
    /**
     *   Force the dev server to write hot reloading changes to disk,
     *   so that browser can serve them.
     */

    const buildPath = './build';

    config.output.path = path.join(__dirname, buildPath);
    config.plugins.push(new WriteFilePlugin());
    config.output.futureEmitAssets = false;
    fs.removeSync(buildPath);
    fs.copySync('./public/', buildPath);

    // Monorepo code sharing
    const newConfig = rewireBabelLoader.include(
        config,
        // our packages that will now be included in the CRA build step
        resolveApp('src'),
        resolveApp('../web/components')
    );
    return rewireYarnWorkspaces(newConfig, env);
};
