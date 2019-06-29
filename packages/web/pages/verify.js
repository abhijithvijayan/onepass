import React, { Component } from 'react';
import { connect } from 'react-redux';

import BodyWrapper from '../components/BodyWrapper';
import Verify from '../components/SignUp/Verify';

class VerifyPage extends Component {
    render() {
        const { isAuthenticated, isVerificationSent } = this.props;
        return <BodyWrapper>{isAuthenticated || isVerificationSent ? <Verify /> : null}</BodyWrapper>;
    }
}

const mapStateToProps = state => {
    const { login, signup } = state.auth;
    return {
        isAuthenticated: login.isAuthenticated,
        isVerificationSent: signup.isVerificationSent,
    };
};

export default connect(mapStateToProps)(VerifyPage);
