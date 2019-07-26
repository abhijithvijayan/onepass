/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/display-name */
import { connect } from 'react-redux';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Field, reset, reduxForm } from 'redux-form';
import { Col, Form, Icon, Input, Select } from 'antd';

const { Option } = Select;

const FormHolder = styled(Form)`
    @media screen and (min-width: ${props => {
            return props.theme.screenSmMin;
        }}) {
        display: inline-block;
        .form__split--component:nth-of-type(even) {
            padding-right: 10px;
        }
        .form__split--component:nth-of-type(odd) {
            padding-left: 10px;
        }
    }
`;

/* eslint-disable-next-line arrow-body-style */
const renderField = ComponentToRender => ({ input, type, icon, label, meta: { touched, invalid, error }, ...rest }) => {
    const isInvalid = touched && invalid;
    const prefix = icon ? <Icon type={icon} /> : undefined;
    const catType = type || undefined;
    return (
        <Form.Item label={label} validateStatus={isInvalid ? 'error' : 'success'} help={isInvalid && error}>
            <ComponentToRender type={catType} prefix={prefix} {...input} {...rest} />
        </Form.Item>
    );
};

const renderInput = renderField(Input);
const renderSelect = renderField(Select);

const afterSubmit = (result, dispatch) => {
    return dispatch(reset('form_in_modal'));
};

class ModalForm extends Component {
    renderFolderSelectOptions = () => {
        const { folders } = this.props;
        return Object.values(folders).map(folder => {
            const { folderId, folderName } = folder;
            return (
                <Option key={folderId} value={folderId}>
                    {folderName}
                </Option>
            );
        });
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <FormHolder onSubmit={handleSubmit(this.props.onSubmit)}>
                <Field label="URL" name="url" type="text" icon="link" component={renderInput} />
                <Col md={{ span: 12 }} className="form__split--component">
                    <Field label="Name" name="name" type="text" component={renderInput} />
                </Col>
                <Col md={{ span: 12 }} className="form__split--component">
                    <Field
                        placeholder="Choose folder"
                        label="Folder"
                        name="folder"
                        showSearch
                        filterOption={(input, option) => {
                            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                        }}
                        component={renderSelect}
                    >
                        {this.renderFolderSelectOptions()}
                    </Field>
                </Col>
                <Col md={{ span: 12 }} className="form__split--component">
                    <Field label="Username" name="username" type="text" icon="user" component={renderInput} />
                </Col>
                <Col md={{ span: 12 }} className="form__split--component">
                    <Field label="Password" name="password" type="password" icon="lock" component={renderInput} />
                </Col>
            </FormHolder>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.name) {
        errors.name = 'Required';
    }
    return errors;
};

const mapStateToProps = (state, ownProps) => {
    return {
        initialValues: ownProps.initialValues,
        folders: ownProps.folders,
    };
};

const FormInModal = connect(
    null,
    mapStateToProps
)(ModalForm);

export default reduxForm({
    form: 'form_in_modal',
    validate,
    onSubmitSuccess: afterSubmit,
    enableReinitialize: true,
})(FormInModal);
