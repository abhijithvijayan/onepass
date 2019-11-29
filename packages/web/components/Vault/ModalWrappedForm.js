import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit } from 'redux-form';
import { Button, Modal } from 'antd';

import FormInModal from './FormInModal';
import { toggleItemModal as toggleItemModalOperation, performVaultItemEncryption } from '../../state/modules/vault/operations';

const ModalWrappedForm = ({
    toggleItemModal,
    submitForm,
    vaultKey,
    email,
    encryptVaultItem,
    isItemModalOpen,
    selectedItemId,
    items,
    folders,
}) => {
    const handleSubmit = () => submitForm('form_in_modal');

    const handleReturn = () => toggleItemModal(false, '');

    const hasProperty = (formValues, property) => Object.prototype.hasOwnProperty.call(formValues, property);

    const onFormSubmit = formValues => {
        let itemId = null;
        let _modified = null;
        const { url = '', name, folder = '', username = '', password = '' } = formValues;
        // If the form is in edit mode, initial values will have fields
        if (hasProperty(formValues, 'itemId') && hasProperty(formValues, '_modified')) {
            ({ itemId, _modified } = formValues);
        }
        const overview = { url, name, folder };
        const details = { username, password };
        encryptVaultItem({ overview, details, vaultKey, email, itemId, _modified });
    };

    let initialValues = { url: '', name: '', username: '', password: '', folder: '' };
    const selectedItem = items[selectedItemId];

    if (selectedItem) {
        const {
            decOverview: { url, name, folder },
            decDetails: { username, password },
            _modified,
        } = selectedItem;

        initialValues = {
            url,
            name,
            folder,
            username,
            password,
            itemId: selectedItemId,
            _modified,
        };
    }

    return (
        <div>
            <Modal
                width={750}
                centered
                visible={isItemModalOpen}
                onOk={handleSubmit}
                onCancel={handleReturn}
                footer={[
                    <Button key="back" onClick={handleReturn}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={false} onClick={handleSubmit}>
                        Submit
                    </Button>,
                ]}
            >
                <FormInModal onSubmit={onFormSubmit} folders={folders} initialValues={initialValues} />
            </Modal>
        </div>
    );
};

const mapStateToProps = state => {
    const {
        vault: { ui, encrypted, decrypted },
    } = state;
    const {
        auth: { login },
    } = state;
    return {
        isItemModalOpen: ui.isItemModalOpen,
        selectedItemId: ui.selectedItemId,
        items: decrypted.items,
        folders: encrypted.folders,
        email: login.user && login.user.email,
        vaultKey: login.decrypted.keys && login.decrypted.keys.decVaultKey,
    };
};

const mapDispatchToProps = dispatch => ({
    toggleItemModal: bindActionCreators(toggleItemModalOperation, dispatch),
    submitForm: bindActionCreators(submit, dispatch),
    encryptVaultItem: bindActionCreators(performVaultItemEncryption, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalWrappedForm);
