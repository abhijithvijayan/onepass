/* eslint-disable no-lonely-if */
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
        const { isAuthenticated, response, error } = nextProps;
        if (!isAuthenticated) {
            Router.push('/login');
        } else {
            // if both error & response exist
            if (error && error.msg && (response && response.msg)) {
                // show the latest response/error based on reported time
                if (error.reportedAt > response.reportedAt) {
                    this.notify(error.msg);
                } else if (error.reportedAt < response.reportedAt) {
                    this.notify(response.msg);
                } else {
                    // show both toasts
                    this.notify(error.msg);
                    this.notify(response.msg);
                }
            }
            // if either error/response exist
            else if ((error && error.msg) || (response && response.msg)) {
                this.notify((error && error.msg) || (response && response.msg));
            }
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

const mapStateToProps = ({ auth: { login }, vault: { encrypted }, errors }) => {
    const response = encrypted.response !== undefined ? encrypted.response : null;
    const error = errors.vault.error !== undefined ? errors.vault.error : null;
    return {
        isAuthenticated: login.isAuthenticated,
        response,
        error,
    };
};

export default connect(mapStateToProps)(VaultPage);
