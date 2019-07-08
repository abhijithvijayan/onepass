import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { logoutUser } from '../state/modules/auth/actions';

class LogoutPage extends Component {
    componentDidMount() {
        this.props.logoutUser();
    }

    render() {
        return <div />;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logoutUser: bindActionCreators(logoutUser, dispatch),
    };
};

export default connect(
    null,
    mapDispatchToProps
)(LogoutPage);
