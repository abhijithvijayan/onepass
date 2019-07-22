import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import BodyWrapper from '../components/BodyWrapper';
import MasterPassword from '../components/SignUp/MasterPassword';

class MasterPasswordPage extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.hasFailedSignUp) {
            Router.push('/signup');
        }
        if (nextProps.isAuthenticated) {
            Router.push('/vault');
        }
        return true;
    }

    render() {
        const { isVerified, isAuthenticated, hasFailedSignUp } = this.props;
        return (
            <BodyWrapper>{!isAuthenticated && isVerified && !hasFailedSignUp ? <MasterPassword /> : null}</BodyWrapper>
        );
    }
}

const mapStateToProps = state => {
    const { signup, login } = state.auth;
    return {
        isAuthenticated: login.isAuthenticated,
        isVerified: signup.isVerified === undefined ? false : signup.isVerified,
        hasFailedSignUp: signup.hasFailedSignUp === undefined ? false : signup.hasFailedSignUp,
    };
};

export default connect(mapStateToProps)(MasterPasswordPage);
