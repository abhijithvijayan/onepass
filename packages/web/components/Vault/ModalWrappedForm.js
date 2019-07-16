import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit } from 'redux-form';
import { Button, Modal } from 'antd';

import FormInModal from './FormInModal';
import { toggleItemModal, performVaultItemEncryption } from '../../state/modules/vault/operations';

class ModalWrappedForm extends Component {
    handleSubmit = () => {
        // Manually submit redux-form
        this.props.submitForm('form_in_modal');
    };

    handleReturn = () => {
        // ToDo: pass id -> Refactor
        this.props.toggleItemModal(false, '');
    };

    onFormSubmit = ({ url = '', name, folder = '', username = '', password = '' }) => {
        const { vaultKey, email } = this.props;
        const overview = {
            url,
            name,
            folder,
        };
        const details = {
            username,
            password,
        };
        this.props.encryptVaultItem({ overview, details, vaultKey, email });
    };

    render() {
        const { isItemModalOpen, selectedItemId, items } = this.props;
        // Initial Values for modalForm
        let initialValues = { url: '', name: '', username: '', password: '' };
        const selectedItem = items[selectedItemId];
        // If item exist
        if (selectedItem) {
            const {
                decOverview: { url, name },
                decDetails: { username, password },
            } = selectedItem;

            initialValues = {
                url,
                name,
                username,
                password,
            };
        }
        return (
            <div>
                <Modal
                    width={750}
                    title="Vault Item"
                    centered
                    visible={isItemModalOpen}
                    onOk={this.handleSubmit}
                    onCancel={this.handleReturn}
                    footer={[
                        <Button key="back" onClick={this.handleReturn}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" loading={false} onClick={this.handleSubmit}>
                            Submit
                        </Button>,
                    ]}
                >
                    <FormInModal onSubmit={this.onFormSubmit} initialValues={initialValues} />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {
        vault: { ui, decrypted },
    } = state;
    const {
        auth: { login },
    } = state;
    return {
        isItemModalOpen: ui.isItemModalOpen,
        selectedItemId: ui.selectedItemId,
        items: decrypted.items,
        email: login.user && login.user.email,
        vaultKey: login.decrypted.keys && login.decrypted.keys.decVaultKey,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleItemModal: bindActionCreators(toggleItemModal, dispatch),
        submitForm: bindActionCreators(submit, dispatch),
        encryptVaultItem: bindActionCreators(performVaultItemEncryption, dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalWrappedForm);
