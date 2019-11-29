import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { toast } from 'react-toastify';

import BodyWrapper from '../components/BodyWrapper';
import MasterPassword from '../components/SignUp/MasterPassword';

class MasterPasswordPage extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        const { isAuthenticated, hasFailedSignUp, error } = nextProps;
        if (hasFailedSignUp) {
            // Wait for the toast to close and redirect
            toast(`${error.msg} Redirecting...`, {
                containerId: 'top__center',
                onClose: prop => Router.push('/signup'),
            });
        }
        if (isAuthenticated) {
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

const mapStateToProps = ({ auth: { signup, login }, errors }) => {
    const error = errors.signup.error !== undefined ? errors.signup.error : null;
    return {
        isAuthenticated: login.isAuthenticated,
        isVerified: signup.isVerified === undefined ? false : signup.isVerified,
        hasFailedSignUp: signup.hasFailedSignUp === undefined ? false : signup.hasFailedSignUp,
        error,
    };
};

export default connect(mapStateToProps)(MasterPasswordPage);
