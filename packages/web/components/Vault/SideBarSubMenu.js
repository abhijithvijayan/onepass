import React from 'react';
import { Menu } from 'antd';

import SideBarMenuItem from './SideBarMenuItem';

const { SubMenu } = Menu;

const SideBarSubMenu = props => {
    const { ...other } = props;
    return (
        <SubMenu {...other}>
            <SideBarMenuItem key={3} />
            <SideBarMenuItem key={4} />
            <SideBarMenuItem key={5} />
        </SubMenu>
    );
};

export default SideBarSubMenu;
