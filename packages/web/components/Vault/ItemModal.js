import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button } from 'antd';

import { toggleItemModal } from '../../state/modules/vault/operations';
import ItemModalForm from './ItemModalForm';

class ItemModal extends Component {
    render() {
        const { isItemModalOpen } = this.props;
        return (
            <div>
                <Modal
                    title="Edit Item"
                    centered
                    visible={isItemModalOpen}
                    onOk={() => {
                        return this.props.toggleItemModal(false);
                    }}
                    onCancel={() => {
                        return this.props.toggleItemModal(false);
                    }}
                >
                    <ItemModalForm />
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
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemModal);
