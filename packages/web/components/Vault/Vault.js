import React, { Component } from 'react';
import { Layout } from 'antd';

import VaultSideBar from './VaultSideBar';

class Vault extends Component {
    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <VaultSideBar />
            </Layout>
        );
    }
}

export default Vault;
