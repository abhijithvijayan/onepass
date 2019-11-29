/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/display-name */
import { connect } from 'react-redux';
import React from 'react';
import styled from 'styled-components';
import { Field, reset, reduxForm } from 'redux-form';
import { Col, Form, Icon, Input, Select } from 'antd';

const { Option } = Select;

const FormHolder = styled(Form)`
    @media screen and (min-width: ${props => props.theme.screenSmMin}) {
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
const renderPasswordInput = renderField(Input.Password);
const renderSelect = renderField(Select);

const afterSubmit = (result, dispatch) => dispatch(reset('form_in_modal'));

const ModalForm = ({ folders, onSubmit, handleSubmit }) => {
    const renderFolderSelectOptions = () =>
        Object.values(folders).map(({ folderId, folderName }) => (
            <Option key={folderId} value={folderId}>
                {folderName}
            </Option>
        ));

    return (
        <FormHolder onSubmit={handleSubmit(onSubmit)}>
            <Field label="URL" name="url" type="text" icon="link" component={renderInput} />
            <Col md={{ span: 12 }} className="form__split--component">
                <Field label="Name" name="name" type="text" component={renderInput} />
            </Col>
            <Col md={{ span: 12 }} className="form__split--component">
                <Field
                    placeholder="Choose folder"
                    label="Folder"
                    name="folder"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    component={renderSelect}
                >
                    {renderFolderSelectOptions()}
                </Field>
            </Col>
            <Col md={{ span: 12 }} className="form__split--component">
                <Field label="Username" name="username" type="text" icon="user" component={renderInput} />
            </Col>
            <Col md={{ span: 12 }} className="form__split--component">
                <Field label="Password" name="password" type="password" icon="lock" component={renderPasswordInput} />
            </Col>
        </FormHolder>
    );
};

const validate = values => {
    const errors = {};
    if (!values.name) {
        errors.name = 'Required';
    }
    return errors;
};

const mapStateToProps = (state, ownProps) => ({
    initialValues: ownProps.initialValues,
    folders: ownProps.folders,
});

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
