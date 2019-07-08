import React, { Component } from 'react';
import { Layout } from 'antd';

import SideBarHeader from './SideBarHeader';
import SideBarMenu from './SideBarMenu';

const { Sider } = Layout;

class VaultSideBar extends Component {
    collapseSideBar = () => {
        // console.log('collapsed');
    };

    render() {
        return (
            <Sider collapsible collapsed onCollapse={this.collapseSideBar}>
                <SideBarHeader />
                <SideBarMenu />
            </Sider>
        );
    }
}

export default VaultSideBar;
