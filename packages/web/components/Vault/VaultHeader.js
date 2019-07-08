import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';

const { Header } = Layout;

const HeaderTitle = styled.h2`
    font-size: 2em;
    color: #000;
`;

const VaultHeader = () => {
    return (
        <Header style={{ background: '#fff', padding: 0 }}>
            <HeaderTitle>OnePass Vault</HeaderTitle>
        </Header>
    );
};

export default VaultHeader;
