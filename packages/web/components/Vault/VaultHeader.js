import React, { Component } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
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

class VaultHeader extends Component {
    render() {
        return (
            <Header
                style={{ background: '#fff', padding: '0px 15px', display: 'flex', justifyContent: 'space-between' }}
            >
                <HeaderTitle>OnePass Vault</HeaderTitle>
                <Dropdown overlay={dropdownMenu}>
                    <span>
                        {this.props.name} <Icon type="down" />
                    </span>
                </Dropdown>
            </Header>
        );
    }
}

const mapStateToProps = ({ auth: { login } }) => {
    return {
        name: login.user.name,
    };
};

export default connect(mapStateToProps)(VaultHeader);
