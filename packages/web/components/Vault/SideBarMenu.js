import React from 'react';
import { Menu, Icon } from 'antd';

import SideBarMenuItem from './SideBarMenuItem';
import SideBarSubMenu from './SideBarSubMenu';

const SideBarMenu = () => {
    return (
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <SideBarMenuItem key={1} />
            <SideBarMenuItem key={2} />
            <SideBarSubMenu
                key="sub1"
                title={
                    <span>
                        <Icon type="user" />
                        <span>User</span>
                    </span>
                }
            />
            <SideBarMenuItem key={6} />
        </Menu>
    );
};

export default SideBarMenu;
