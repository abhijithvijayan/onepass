/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/display-name */
import { connect } from 'react-redux';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Field, reduxForm } from 'redux-form';
import { Cascader, Col, Form, Icon, Input } from 'antd';

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

const cascaderOptions = [
    {
        value: 'business',
        label: 'ABusiness',
        children: [
            {
                value: 'company',
                label: 'ACompany',
            },
        ],
    },
    {
        value: 'social',
        label: 'Social',
    },
];

const renderInput = renderField(Input);
const renderSelect = renderField(Cascader);

class ModalForm extends Component {
    render() {
        const { handleSubmit } = this.props;
        return (
            <FormHolder onSubmit={handleSubmit(this.props.onSubmit)}>
                <Field label="URL" name="url" type="text" icon="link" component={renderInput} />
                <Col md={{ span: 12 }} className="form__split--component">
                    <Field label="Name" name="name" type="text" component={renderInput} />
                </Col>
                {/* To Be Fixed - ref: https://github.com/erikras/redux-form/issues/4503 */}
                <Col md={{ span: 12 }} className="form__split--component">
                    <Field
                        options={cascaderOptions}
                        placeholder="Please select"
                        label="Folder"
                        name="folder"
                        component={renderSelect}
                    />
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

const FormInModal = connect()(ModalForm);

export default reduxForm({
    form: 'form_in_modal',
    validate,
})(FormInModal);
