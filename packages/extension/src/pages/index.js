import React, { Component } from 'react';
import browser from 'webextension-polyfill';

import Home from '@onepass/web/components/Home';
import BodyWrapper from '@onepass/web/components/BodyWrapper';

class IndexPage extends Component {
    componentDidMount() {
        /* eslint-disable no-undef */
        browser.tabs.query({ active: true, currentWindow: true }, tabs => {
            browser.tabs.sendMessage(tabs[0].id, { greeting: 'hello' }, function(response) {
                /* eslint-disable no-console */
                console.log(response);
            });
        });
    }

    render() {
        return (
            <BodyWrapper>
                <Home />
            </BodyWrapper>
        );
    }
}

export default IndexPage;
