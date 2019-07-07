// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const withImages = require('next-images');
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
        withImages,
    ],
    {
        webpack(config, { isServer }) {
            // to ignore [mini-css-extract-plugin] Conflicting order between warning
            config.stats = {};
            config.stats.warnings = false;
            config.stats.warningsFilter = warning => {
                return /Conflicting order between/gm.test(warning);
            };
            // local env variables
            config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
            // antdesign css config
            if (isServer) {
                const antStyles = /antd\/.*?\/style\/css.*?/;
                const origExternals = [...config.externals];
                config.externals = [
                    (context, request, callback) => {
                        if (request.match(antStyles)) return callback();
                        if (typeof origExternals[0] === 'function') {
                            origExternals[0](context, request, callback);
                        } else {
                            callback();
                        }
                    },
                    ...(typeof origExternals[0] === 'function' ? [] : origExternals),
                ];

                config.module.rules.unshift({
                    test: antStyles,
                    use: 'null-loader',
                });
            }
            return config;
        },
    }
);
