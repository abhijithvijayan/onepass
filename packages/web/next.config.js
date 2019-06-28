/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withTM = require('next-transpile-modules');
const { parsed: localEnv } = require('dotenv').config({ path: 'variables.env' });
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins(
    [
        [
            withTM,
            {
                // Tell webpack to compile the "@onepass/core" package
                transpileModules: ['@onepass/core', '@onepass/server'],
            },
        ],
        withCSS,
        withSass,
    ],
    {
        webpack(config) {
            config.plugins.push(new webpack.EnvironmentPlugin(localEnv));

            return config;
        },
    }
);
