import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout } from 'antd';
import styled from 'styled-components';

import SideBarHeader from './SideBarHeader';
import SideBarMenu from './SideBarMenu';
import { toggleSideBar } from '../../state/modules/vault/operations';

const { Sider } = Layout;

const SideBar = styled(Sider)`
    z-index: 2;
    position: relative;
    @media screen and (max-width: ${props => {
            return props.theme.screenXxsMax;
        }}) {
        display: none;
    }
`;

class VaultSideBar extends Component {
    toggleSideBar = toggleStatus => {
        this.props.toggleSideBar(toggleStatus);
    };

    render() {
        const { isSideBarOpen } = this.props;
        return (
            <SideBar
                collapsible
                collapsed={!isSideBarOpen}
                onCollapse={() => {
                    return this.toggleSideBar(!isSideBarOpen);
                }}
            >
                <SideBarHeader />
                <SideBarMenu />
            </SideBar>
        );
    }
}

const mapStateToProps = ({ vault: { ui } }) => {
    return {
        isSideBarOpen: ui.isSideBarOpen,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleSideBar: bindActionCreators(toggleSideBar, dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VaultSideBar);
