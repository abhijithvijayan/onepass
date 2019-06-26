import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

class OnePassDocument extends Document {
    static getInitialProps({ renderPage }) {
        const sheet = new ServerStyleSheet();
        const page = renderPage(App => {
            return props => {
                return sheet.collectStyles(<App {...props} />);
            };
        });
        const styleTags = sheet.getStyleElement();
        return { ...page, styleTags };
    }

    render() {
        return (
            <html lang="en">
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
                    <meta
                        name="description"
                        content="OnePass Password Manager: A free and open source secure password manager"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

export default OnePassDocument;
