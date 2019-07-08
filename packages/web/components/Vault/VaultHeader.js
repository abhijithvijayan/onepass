import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { bindActionCreators } from 'redux';
import { Layout } from 'antd';

import { logoutUser } from '../../state/modules/auth/actions';

class VaultHeader extends Component {
    handleButtonClick() {
        const { isAuthenticated } = this.props;
        if (isAuthenticated) {
            this.props.logoutUser();
        } else {
            Router.push('/login');
        }
    }

    renderButtonText() {
        const { isAuthenticated } = this.props;
        return isAuthenticated ? 'logout' : 'login';
    }

    render() {
        const { Header, Content, Footer } = Layout;
        return (
            <Header>
                <div className="logo">OnePass Logo</div>
            </Header>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.login.isAuthenticated,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logoutUser: bindActionCreators(logoutUser, dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VaultHeader);
