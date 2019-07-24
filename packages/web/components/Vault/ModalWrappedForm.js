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
        this.props.toggleItemModal(false, '');
    };

    hasProperty = (formValues, property) => {
        return Object.prototype.hasOwnProperty.call(formValues, property);
    };

    onFormSubmit = formValues => {
        let itemId = null;
        let modifiedAt = null;
        const { vaultKey, email } = this.props;
        const { url = '', name, folder = '', username = '', password = '' } = formValues;
        // If the form is in edit mode, initial values will have fields
        if (this.hasProperty(formValues, 'itemId') && this.hasProperty(formValues, 'modifiedAt')) {
            ({ itemId, modifiedAt } = formValues);
        }
        const overview = {
            url,
            name,
            folder,
        };
        const details = {
            username,
            password,
        };
        this.props.encryptVaultItem({ overview, details, vaultKey, email, itemId, modifiedAt });
    };

    render() {
        const { isItemModalOpen, selectedItemId, items } = this.props;
        // Initial Values for modalForm
        let initialValues = { url: '', name: '', username: '', password: '' };
        const selectedItem = items[selectedItemId];
        // If item exist in store
        if (selectedItem) {
            const {
                decOverview: { url, name },
                decDetails: { username, password },
                modifiedAt,
            } = selectedItem;

            initialValues = {
                url,
                name,
                username,
                password,
                itemId: selectedItemId,
                modifiedAt,
            };
        }
        return (
            <div>
                <Modal
                    width={750}
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
