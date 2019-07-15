import React, { Component } from 'react';

import BodyWrapper from '../components/BodyWrapper';
import Home from '../components/Home';

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
