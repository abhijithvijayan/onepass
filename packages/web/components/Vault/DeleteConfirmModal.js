import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button, Icon, Modal } from 'antd';

import { deleteVaultItem, toggleConfirmDeleteModal } from '../../state/modules/vault/operations';

const ModalWrapper = styled.div`
    transition: all 0.3s;
`;

const ModalContentWrapper = styled(Modal)`
    .ant-modal-footer {
        border-top: none;
        padding: 0 32px 24px 32px;
    }
`;

const ModalHeader = styled.div`
    display: flex;
    flex-direction: row;
    .anticon {
        font-size: 22px;
        margin-right: 16px;
    }
`;

const ModalWarningMessage = styled.span`
    display: block;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 18px;
    line-height: 1.4;
`;

const ModalBody = styled.div`
    margin-left: 38px;
    margin-top: 8px;
    p {
        color: rgba(0, 0, 0, 0.65);
        font-size: 16px;
        margin-bottom: 0px;
    }
`;

class DeleteConfirmModal extends Component {
    handleOk = () => {
        const { selectedItemId } = this.props;
        this.props.deleteVaultItem({ itemId: selectedItemId });
    };

    handleCancel = () => {
        this.props.toggleConfirmDeleteModal(false, '');
    };

    renderModalBody = currentItemName => {
        return (
            <React.Fragment>
                <ModalHeader>
                    <Icon type="exclamation-circle" />
                    <ModalWarningMessage>Are you sure you want to delete the site?</ModalWarningMessage>
                </ModalHeader>
                <ModalBody>
                    <p>{currentItemName}</p>
                </ModalBody>
            </React.Fragment>
        );
    };

    renderModalFooter = () => {
        return [
            <Button key="back" onClick={this.handleCancel}>
                Cancel
            </Button>,
            <Button key="submit" type="primary" loading={false} onClick={this.handleOk}>
                Delete
            </Button>,
        ];
    };

    renderModal = ({ isDeleteModalOpen, currentItemName }) => {
        return (
            <ModalContentWrapper
                closable={false}
                visible={isDeleteModalOpen}
                centered
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={this.renderModalFooter()}
            >
                {this.renderModalBody(currentItemName)}
            </ModalContentWrapper>
        );
    };

    render() {
        const { isDeleteModalOpen } = this.props;
        return <ModalWrapper>{isDeleteModalOpen ? this.renderModal(this.props) : null}</ModalWrapper>;
    }
}

const mapStateToProps = state => {
    const {
        vault: { ui, decrypted },
    } = state;
    const currentItem = decrypted.items[ui.selectedItemId] && decrypted.items[ui.selectedItemId].decOverview;
    return {
        selectedItemId: ui.selectedItemId,
        currentItemName: currentItem ? currentItem.name : '',
        isDeleteModalOpen: ui.isDeleteModalOpen,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        deleteVaultItem: bindActionCreators(deleteVaultItem, dispatch),
        toggleConfirmDeleteModal: bindActionCreators(toggleConfirmDeleteModal, dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeleteConfirmModal);
