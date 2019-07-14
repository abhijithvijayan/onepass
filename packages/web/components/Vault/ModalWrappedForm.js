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
        // this.props.toggleItemModal(false);
    };

    handleReturn = () => {
        this.props.toggleItemModal(false);
    };

    onFormSubmit = ({ url = '', name, folder = '', username = '', password = '' }) => {
        const { vaultKey } = this.props;
        const overview = {
            url,
            name,
            folder,
        };
        const details = {
            username,
            password,
        };
        /* eslint-disable-next-line no-console */
        console.log('Received Values:', url, name, folder, username, password);
        this.props.encryptVaultItem({ overview, details, vaultKey });
    };

    render() {
        const { isItemModalOpen } = this.props;
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
                    <FormInModal onSubmit={this.onFormSubmit} />
                </Modal>
            </div>
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
        isItemModalOpen: ui.isItemModalOpen,
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
