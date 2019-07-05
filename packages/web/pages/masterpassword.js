import React, { Component } from 'react';
import { connect } from 'react-redux';

import BodyWrapper from '../components/BodyWrapper';
import MasterPassword from '../components/SignUp/MasterPassword';

class MasterPasswordPage extends Component {
    render() {
        const { isVerified, isAuthenticated } = this.props;
        return <BodyWrapper>{isVerified && !isAuthenticated ? <MasterPassword /> : null}</BodyWrapper>;
    }
}

const mapStateToProps = state => {
    const { signup, login } = state.auth;
    return {
        isAuthenticated: login.isAuthenticated,
        isVerified: signup.isVerified === undefined ? false : signup.isVerified,
    };
};

export default connect(mapStateToProps)(MasterPasswordPage);
