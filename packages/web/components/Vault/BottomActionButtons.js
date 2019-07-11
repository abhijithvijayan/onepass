import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';

import { toggleItemModal, expandActionButtons } from '../../state/modules/vault/operations';

const ActionBarHolder = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: 30px;
    margin-bottom: 10px;
    z-index: 2;
`;

const ButtonWrapper = styled.li`
    padding-top: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    div {
        border: 1px solid rgba(0, 0, 0, 0.3);
        border-right: 0;
        background: ${props => {
            return props.theme.grayWhite;
        }};
        margin-right: 10px;
        padding: 5px 10px;
        border-radius: 15px 0 0 15px;
        font-size: 1.2rem;
    }
`;

const ActionButton = styled(Button)`
    width: 4rem !important;
    height: 4rem !important;
    background-color: #002140 !important;
    border-color: #002140 !important;
    .anticon {
        font-size: 2.2rem;
        display: inline-flex;
    }
`;

class BottomActionButtons extends Component {
    renderAddFolderButton = () => {
        return (
            <ButtonWrapper>
                <div>Add Folder</div>
                <ActionButton type="primary" shape="circle" icon="folder-add" />
            </ButtonWrapper>
        );
    };

    showRow = () => {
        this.props.expandActionButtons(true);
    };

    hideRow = () => {
        this.props.expandActionButtons(false);
    };

    render() {
        return (
            <ActionBarHolder onMouseEnter={this.showRow} onMouseLeave={this.hideRow}>
                <ul>
                    {this.props.hoverOverActionButtons ? this.renderAddFolderButton() : null}
                    <ButtonWrapper>
                        {this.props.hoverOverActionButtons ? <div>Add Item</div> : null}
                        <ActionButton
                            onClick={() => {
                                return this.props.toggleItemModal(true);
                            }}
                            type="primary"
                            shape="circle"
                            icon="plus"
                        />
                    </ButtonWrapper>
                </ul>
            </ActionBarHolder>
        );
    }
}

const mapStateToProps = ({ vault: { ui } }) => {
    return {
        isItemModalOpen: ui.isItemModalOpen,
        hoverOverActionButtons: ui.hoverOverActionButtons,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleItemModal: bindActionCreators(toggleItemModal, dispatch),
        expandActionButtons: bindActionCreators(expandActionButtons, dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BottomActionButtons);
