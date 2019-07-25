import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { toast } from 'react-toastify';

import BodyWrapper from '../components/BodyWrapper';
import Verify from '../components/SignUp/Verify';

class VerifyPage extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        const { isVerified, error } = nextProps;
        if (isVerified) {
            Router.push('/masterpassword', '/signup/masterpassword');
        } else {
            this.notify(error.msg);
        }
        return true;
    }

    notify = message => {
        return toast(message, { containerId: 'top__center' });
    };

    render() {
        const { isAuthenticated, isVerificationSent, isVerified } = this.props;
        return <BodyWrapper>{!isAuthenticated && isVerificationSent && !isVerified ? <Verify /> : null}</BodyWrapper>;
    }
}

const mapStateToProps = ({ auth: { signup, login }, errors }) => {
    const error = errors.signup.error !== undefined ? errors.signup.error : null;
    return {
        isAuthenticated: login.isAuthenticated,
        isVerificationSent: signup.isVerificationSent === undefined ? false : signup.isVerificationSent,
        isVerified: signup.isVerified === undefined ? false : signup.isVerified,
        error,
    };
};

export default connect(mapStateToProps)(VerifyPage);
