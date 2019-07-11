import React, { Component } from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';

import ModalWrappedForm from './ModalWrappedForm';
import VaultFooter from './VaultFooter';
import VaultSideBar from './VaultSideBar';
import VaultHeader from './VaultHeader';
import VaultContent from './VaultContent';
import BottomActionButtons from './BottomActionButtons';

const VaultLayout = styled(Layout)`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

class Vault extends Component {
    render() {
        return (
            <VaultLayout className="mh-100">
                <VaultSideBar />
                <Layout>
                    <VaultHeader />
                    <VaultContent />
                    <BottomActionButtons />
                    {/* <VaultFooter /> */}
                </Layout>
                <ModalWrappedForm />
            </VaultLayout>
        );
    }
}

export default Vault;
