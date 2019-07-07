import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { Breadcrumb, Layout, Menu } from 'antd';

import Button from '../Button';
import { logoutUser } from '../../state/modules/auth/actions';

class VaultHeader extends Component {
    handleButtonClick() {
        const { isAuthenticated } = this.props;
        if (isAuthenticated) {
            this.props.logoutUser();
        } else {
            Router.push('/login');
        }
    }

    renderButtonText() {
        const { isAuthenticated } = this.props;
        return isAuthenticated ? 'logout' : 'login';
    }

    render() {
        const { Header, Content, Footer } = Layout;
        return (
            <Layout className="layout">
                <Header>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} style={{ lineHeight: '64px' }}>
                        <Menu.Item key="1">
                            <Button
                                onClick={() => {
                                    return this.handleButtonClick();
                                }}
                                text={this.renderButtonText()}
                            />
                        </Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>Content</div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>OnePass © 2019</Footer>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.login.isAuthenticated,
    };
};

export default connect(
    mapStateToProps,
    { logoutUser }
)(VaultHeader);
