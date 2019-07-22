import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import BodyWrapper from '../components/BodyWrapper';
import Verify from '../components/SignUp/Verify';

class VerifyPage extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.isVerified) {
            Router.push('/masterpassword', '/signup/masterpassword');
        }
        return true;
    }

    render() {
        const { isAuthenticated, isVerificationSent, isVerified } = this.props;
        return <BodyWrapper>{!isAuthenticated && isVerificationSent && !isVerified ? <Verify /> : null}</BodyWrapper>;
    }
}

const mapStateToProps = state => {
    const { signup, login } = state.auth;
    return {
        isAuthenticated: login.isAuthenticated,
        isVerificationSent: signup.isVerificationSent === undefined ? false : signup.isVerificationSent,
        isVerified: signup.isVerified === undefined ? false : signup.isVerified,
    };
};

export default connect(mapStateToProps)(VerifyPage);
