import React, { Component } from 'react';
import { connect } from 'react-redux';

import BodyWrapper from '../components/BodyWrapper';
import Login from '../components/Login';

class IndexPage extends Component {
    render() {
        return (
            <BodyWrapper>
                <Login />
            </BodyWrapper>
        );
    }
}

export default connect()(IndexPage);
