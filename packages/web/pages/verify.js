import React, { Component } from 'react';
import { connect } from 'react-redux';

import BodyWrapper from '../components/BodyWrapper';
import Verify from '../components/SignUp/Verify';

class VerifyPage extends Component {
    render() {
        const { isVerificationSent, isVerified } = this.props;
        return <BodyWrapper>{isVerificationSent && !isVerified ? <Verify /> : null}</BodyWrapper>;
    }
}

const mapStateToProps = state => {
    const { signup } = state.auth;
    return {
        isVerificationSent: signup.isVerificationSent === undefined ? false : signup.isVerificationSent,
        isVerified: signup.isVerified === undefined ? false : signup.isVerified,
    };
};

export default connect(mapStateToProps)(VerifyPage);
