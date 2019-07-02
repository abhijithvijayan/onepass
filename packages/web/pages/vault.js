import React, { Component } from 'react';
import { connect } from 'react-redux';

import BodyWrapper from '../components/BodyWrapper';
import Vault from '../components/Vault';

class VaultPage extends Component {
    render() {
        return (
            <BodyWrapper>
                <Vault />
            </BodyWrapper>
        );
    }
}

export default connect()(VaultPage);
