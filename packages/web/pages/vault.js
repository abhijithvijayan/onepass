import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import decodeJwt from 'jwt-decode';

import BodyWrapper from '../components/BodyWrapper';
import Vault from '../components/Vault';
import { authUser } from '../state/modules/auth/actions';

class VaultPage extends Component {
    componentDidMount() {
        if (!this.props.isAuthenticated) {
            Router.push('/login');
        }
    }

    render() {
        return (
            this.props.isAuthenticated && (
                <BodyWrapper>
                    <Vault />
                </BodyWrapper>
            )
        );
    }
}

VaultPage.getInitialProps = ({ req, store }) => {
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

export default connect(mapStateToProps)(VaultPage);
