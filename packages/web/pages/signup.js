import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import SignUp from '../components/SignUp';
import BodyWrapper from '../components/BodyWrapper';

class SignUpPage extends Component {
    componentDidMount() {
        if (this.props.isAuthenticated) {
            Router.push('/vault');
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.isVerificationSent) {
            Router.push('/verify', '/signup/verify');
        }
        return true;
    }

    render() {
        const { isAuthenticated, isVerificationSent } = this.props;
        return (
            !isAuthenticated &&
            !isVerificationSent && (
                <BodyWrapper>
                    <SignUp />
                </BodyWrapper>
            )
        );
    }
}

const mapStateToProps = ({ auth: { login, signup } }) => {
    return {
        isAuthenticated: login.isAuthenticated,
        isVerificationSent: signup.isVerificationSent === undefined ? false : signup.isVerificationSent,
    };
};

export default connect(mapStateToProps)(SignUpPage);
