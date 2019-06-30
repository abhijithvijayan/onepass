import React, { Component } from 'react';
import { connect } from 'react-redux';

import BodyWrapper from '../components/BodyWrapper';

class HomePage extends Component {
    render() {
        return (
            <BodyWrapper>
                <div>Vault Home Page</div>
            </BodyWrapper>
        );
    }
}

export default connect()(HomePage);
