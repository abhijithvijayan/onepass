import React from 'react';
import Link from 'next/link';
import { Layout, Dropdown, Icon, Menu } from 'antd';
import styled from 'styled-components';

const { Header } = Layout;

const HeaderTitle = styled.h2`
    font-size: 2em;
    color: #000;
`;

const dropdownMenu = (
    <Menu>
        <Menu.Item key="0">
            <Link href="/logout">
                <a>Logout</a>
            </Link>
        </Menu.Item>
    </Menu>
);

const VaultHeader = () => {
    return (
        <Header style={{ background: '#fff', padding: '0px 15px', display: 'flex', justifyContent: 'space-between' }}>
            <HeaderTitle>OnePass Vault</HeaderTitle>
            <Dropdown overlay={dropdownMenu}>
                <a className="ant-dropdown-link" href="/">
                    John <Icon type="down" />
                </a>
            </Dropdown>
        </Header>
    );
};

export default VaultHeader;
