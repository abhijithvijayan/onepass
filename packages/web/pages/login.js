import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

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
        }
        return true;
    }

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

const mapStateToProps = ({ auth: { login } }) => {
    return {
        isAuthenticated: login.isAuthenticated,
    };
};

export default connect(mapStateToProps)(LoginPage);
