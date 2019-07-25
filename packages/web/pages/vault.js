import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { toast } from 'react-toastify';

import BodyWrapper from '../components/BodyWrapper';
import Vault from '../components/Vault';

class VaultPage extends Component {
    componentDidMount() {
        if (!this.props.isAuthenticated) {
            Router.push('/login');
        } else {
            this.notify('Logged in');
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { isAuthenticated, error } = nextProps;
        if (!isAuthenticated) {
            Router.push('/login');
        } else {
            this.notify(error.msg);
        }
        return true;
    }

    notify = message => {
        return toast(message, { containerId: 'top__right' });
    };

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

const mapStateToProps = ({ auth: { login }, errors }) => {
    const error = errors.vault.error !== undefined ? errors.vault.error : null;
    return {
        isAuthenticated: login.isAuthenticated,
        error,
    };
};

export default connect(mapStateToProps)(VaultPage);
