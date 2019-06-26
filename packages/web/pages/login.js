import React, { Component } from 'react';
import { connect } from 'react-redux';

import Login from '../components/Login';
import BodyWrapper from '../components/BodyWrapper';

class LoginPage extends Component {
    render() {
        return (
            <BodyWrapper>
                <Login />
            </BodyWrapper>
        );
    }
}

export default connect()(LoginPage);
