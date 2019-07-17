import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';

import { deleteVaultItem, toggleConfirmDeleteModal } from '../../state/modules/vault/operations';

class DeleteConfirmModal extends Component {
    handleOk = () => {
        const { email, selectedItemId } = this.props;
        this.props.deleteVaultItem({ email, selectedItemId });
    };

    handleCancel = () => {
        this.props.toggleConfirmDeleteModal(false, '');
    };

    render() {
        const { isDeleteModalOpen } = this.props;
        return (
            <Modal
                closable={false}
                visible={isDeleteModalOpen}
                centered
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={false} onClick={this.handleOk}>
                        Delete
                    </Button>,
                ]}
            >
                <p>Do</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    const {
        vault: { ui },
    } = state;
    const {
        auth: { login },
    } = state;
    return {
        email: login.user.email,
        selectedItemId: ui.selectedItemId,
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
