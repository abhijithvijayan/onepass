/* eslint-disable jsx-a11y/label-has-for */
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Form, Icon, Input } from 'antd';

import { submitSignUpData } from '../../state/modules/auth/operations';

const renderInputField = ({ input, type, icon, label, meta: { touched, invalid, error } }) => {
    const isInvalid = touched && invalid;
    return (
        <Form.Item label={label} validateStatus={isInvalid ? 'error' : 'success'} help={isInvalid && error}>
            <Input {...input} type={type} prefix={<Icon type={icon} />} />
        </Form.Item>
    );
};

class SignUpForm extends Component {
    onSubmit = ({ email, name }) => {
        this.props.submitSignUpData({ email, name });
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Field name="name" type="text" icon="user" component={renderInputField} label="Name" />
                <Field name="email" type="email" icon="mail" component={renderInputField} label="Email" />
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }
    if (!values.name) {
        errors.name = 'Required';
    }
    return errors;
};

const SignUpFormWrapper = connect(
    null,
    {
        submitSignUpData,
    }
)(SignUpForm);

export default reduxForm({
    form: 'signup_form',
    validate,
})(SignUpFormWrapper);
