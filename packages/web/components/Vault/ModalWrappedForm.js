import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit } from 'redux-form';
import { Button, Modal } from 'antd';

import { toggleItemModal } from '../../state/modules/vault/operations';
import FormInModal from './FormInModal';

class ModalWrappedForm extends Component {
    handleSubmit = () => {
        // Manually submit redux-form
        this.props.submitForm('form_in_modal');
        // this.props.toggleItemModal(false);
    };

    handleReturn = () => {
        this.props.toggleItemModal(false);
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
                    <FormInModal />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = ({ vault }) => {
    return {
        isItemModalOpen: vault.isItemModalOpen,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleItemModal: bindActionCreators(toggleItemModal, dispatch),
        submitForm: bindActionCreators(submit, dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalWrappedForm);
