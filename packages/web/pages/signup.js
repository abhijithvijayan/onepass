import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { toast } from 'react-toastify';

import SignUp from '../components/SignUp';
import BodyWrapper from '../components/BodyWrapper';

class SignUpPage extends Component {
    componentDidMount() {
        if (this.props.isAuthenticated) {
            Router.push('/vault');
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { isVerificationSent, error } = nextProps;
        if (isVerificationSent) {
            Router.push('/verify', '/signup/verify');
        } else {
            this.notify(error.msg);
        }
        return true;
    }

    notify = message => {
        return toast(message, { containerId: 'top__center' });
    };

    render() {
        const { isAuthenticated, isVerificationSent, hasFailedSignUp } = this.props;
        return (
            !isAuthenticated &&
            (!isVerificationSent || hasFailedSignUp) && (
                <BodyWrapper>
                    <SignUp />
                </BodyWrapper>
            )
        );
    }
}

const mapStateToProps = ({ auth: { login, signup }, errors }) => {
    const error = errors.signup.error !== undefined ? errors.signup.error : null;
    return {
        isAuthenticated: login.isAuthenticated,
        isVerificationSent: signup.isVerificationSent === undefined ? false : signup.isVerificationSent,
        hasFailedSignUp: signup.hasFailedSignUp === undefined ? false : signup.hasFailedSignUp,
        error,
    };
};

export default connect(mapStateToProps)(SignUpPage);
