import React, { Component } from 'react';
import { connect } from 'react-redux';
import decodeJwt from 'jwt-decode';
import Router from 'next/router';

import SignUp from '../components/SignUp';
import BodyWrapper from '../components/BodyWrapper';
import { authUser } from '../state/modules/auth/actions';

class SignUpPage extends Component {
    componentDidMount() {
        if (this.props.isAuthenticated) {
            Router.push('/vault');
        }
    }

    render() {
        return (
            !this.props.isAuthenticated && (
                <BodyWrapper>
                    <SignUp />
                </BodyWrapper>
            )
        );
    }
}

SignUpPage.getInitialProps = ({ req, store }) => {
    const token = req && req.cookies && req.cookies.token;
    if (token && store) {
        store.dispatch(authUser(decodeJwt(token)));
    }
    return {};
};

const mapStateToProps = ({ auth: { login } }) => {
    return {
        isAuthenticated: login.isAuthenticated,
    };
};

export default connect(mapStateToProps)(SignUpPage);
