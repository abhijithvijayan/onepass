import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import BodyWrapper from '../components/BodyWrapper';
import Vault from '../components/Vault';

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

const mapStateToProps = ({ auth: { login } }) => {
    return {
        isAuthenticated: login.isAuthenticated,
    };
};

export default connect(mapStateToProps)(VaultPage);
