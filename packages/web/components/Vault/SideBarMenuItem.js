import React from 'react';
import { Menu, Icon } from 'antd';

const SideBarMenuItem = props => {
    const { ...other } = props;
    return (
        <Menu.Item {...other}>
            <Icon type="pie-chart" />
            <span>Option 1</span>
        </Menu.Item>
    );
};

export default SideBarMenuItem;
