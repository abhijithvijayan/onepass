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

const mapStateToProps = ({ auth: { login } }) => {
    return {
        isAuthenticated: login.isAuthenticated,
    };
};

export default connect(mapStateToProps)(SignUpPage);
