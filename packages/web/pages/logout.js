import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Router from 'next/router';

import { logoutUser, authUser } from '../state/modules/auth/actions';

class LogoutPage extends Component {
    componentDidMount = async () => {
        await this.props.logoutUser();
        Router.push('/login');
    };

    render() {
        return <div />;
    }
}

const mapDispatchToProps = dispatch => ({
    logoutUser: bindActionCreators(logoutUser, dispatch),
    authUser: bindActionCreators(authUser, dispatch),
});

export default connect(
    null,
    mapDispatchToProps
)(LogoutPage);
