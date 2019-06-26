/* eslint-disable import/no-unresolved */
import React from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import { ThemeProvider } from 'styled-components';

/* Common SASS styles */
import '../styles/main.scss';
import { initializeStore } from '../state/store';

// eslint-disable-next-line import/no-webpack-loader-syntax
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/base/_variables.scss');
// Require sass variables using sass-extract-loader and specify the plugin

class OnePassApp extends App {
    static async getInitialProps({ Component, ctx }) {
        // https://github.com/kirill-konshin/next-redux-wrapper#usage
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
        return { pageProps };
    }

    render() {
        const { Component, pageProps, store } = this.props;
        return (
            <Container>
                <Head>
                    <title>OnePass Password Manager</title>
                </Head>
                <Provider store={store}>
                    <ThemeProvider theme={theme}>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </Provider>
            </Container>
        );
    }
}

export default withRedux(initializeStore)(OnePassApp);
