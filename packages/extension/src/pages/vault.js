import React, { Component } from 'react';
import { connect } from 'react-redux';

import Vault from '@onepass/web/components/Vault';
import BodyWrapper from '@onepass/web/components/BodyWrapper';

class VaultPage extends Component {
    componentDidMount() {
        if (!this.props.isAuthenticated) {
            this.props.history.push('/login');
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
