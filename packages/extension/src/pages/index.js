import React, { Component } from 'react';

import Home from '@onepass/web/components/Home';
import BodyWrapper from '@onepass/web/components/BodyWrapper';

class IndexPage extends Component {
    render() {
        return (
            <BodyWrapper>
                <Home />
            </BodyWrapper>
        );
    }
}

export default IndexPage;
