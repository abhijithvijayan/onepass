import React, { Component } from 'react';
import { Layout } from 'antd';

import VaultFooter from './VaultFooter';
import VaultSideBar from './VaultSideBar';
import VaultHeader from './VaultHeader';
import VaultContent from './VaultContent';

class Vault extends Component {
    render() {
        return (
            <Layout className="mh-100">
                <VaultSideBar />
                <Layout>
                    <VaultHeader />
                    <VaultContent />
                    <VaultFooter />
                </Layout>
            </Layout>
        );
    }
}

export default Vault;
