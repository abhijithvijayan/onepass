/* eslint-disable import/no-unresolved */
const fs = require('fs');
const path = require('path');

const rewireBabelLoader = require('react-app-rewire-babel-loader');
const rewireYarnWorkspaces = require('react-app-rewire-yarn-workspaces');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => {
    return path.resolve(appDirectory, relativePath);
};

module.exports = function override(config, env) {
    const newConfig = rewireBabelLoader.include(
        config,
        // our packages that will now be included in the CRA build step
        resolveApp('src'),
        resolveApp('../web/components')
    );
    return rewireYarnWorkspaces(newConfig, env);
};
