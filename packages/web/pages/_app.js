import React from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';

import { initializeStore } from '../state/store';

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
                    <Component {...pageProps} />
                </Provider>
            </Container>
        );
    }
}

export default withRedux(initializeStore)(OnePassApp);
