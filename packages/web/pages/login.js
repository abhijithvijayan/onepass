import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { toast } from 'react-toastify';

import Login from '../components/Login';
import BodyWrapper from '../components/BodyWrapper';

class LoginPage extends Component {
    componentDidMount() {
        if (this.props.isAuthenticated) {
            Router.push('/vault');
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.isAuthenticated) {
            Router.push('/vault');
        } else {
            this.notify(nextProps.error);
        }
        return true;
    }

    notify = message => {
        return toast(message, { containerId: 'top__center' });
    };

    render() {
        return (
            !this.props.isAuthenticated && (
                <BodyWrapper>
                    <Login />
                </BodyWrapper>
            )
        );
    }
}

const mapStateToProps = ({ auth: { login }, errors }) => {
    const error = errors.login.error !== undefined ? errors.login.error : null;
    return {
        isAuthenticated: login.isAuthenticated,
        error,
    };
};

export default connect(mapStateToProps)(LoginPage);
