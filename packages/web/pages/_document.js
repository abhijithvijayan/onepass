import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

const style = {
    margin: 0,
    backgroundColor: '#fff',
    overflowX: 'hidden',
    color: 'black',
};

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
                    <link
                        rel="stylesheet"
                        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
                        crossOrigin="anonymous"
                    />
                </Head>
                <body style={style}>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

export default OnePassDocument;
