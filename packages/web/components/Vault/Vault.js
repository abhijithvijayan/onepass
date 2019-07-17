import React, { Component } from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';

import VaultHeader from './VaultHeader';
import VaultSideBar from './VaultSideBar';
import VaultContent from './VaultContent';
import VaultFooter from './VaultFooter';
import PdfModal from './PdfModal';
import ModalWrappedForm from './ModalWrappedForm';
import BottomActionButtons from './BottomActionButtons';

const VaultLayout = styled(Layout)`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

const Vault = () => {
    return (
        <VaultLayout className="mh-100">
            <VaultSideBar />
            <Layout>
                <VaultHeader />
                <VaultContent />
                <BottomActionButtons />
                {/* <VaultFooter /> */}
                <PdfModal />
            </Layout>
            <ModalWrappedForm />
        </VaultLayout>
    );
};

export default Vault;
