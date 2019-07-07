import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Form, Icon, Input } from 'antd';

import { submitLoginData } from '../../state/modules/auth/operations';

const renderInputField = ({ input, type, icon, label, meta: { touched, invalid, error } }) => {
    const isInvalid = touched && invalid;
    return (
        <Form.Item label={label} validateStatus={isInvalid ? 'error' : 'success'} help={isInvalid && error}>
            <Input {...input} type={type} prefix={<Icon type={icon} />} />
        </Form.Item>
    );
};

class LoginForm extends Component {
    onSubmit = ({ email, password, secretKey }) => {
        this.props.submitLoginData({ email, password, secretKey });
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Field name="email" type="email" icon="mail" component={renderInputField} label="Email" />
                <Field name="secretKey" type="text" icon="key" component={renderInputField} label="Secret Key" />
                <Field
                    name="password"
                    type="password"
                    icon="lock"
                    component={renderInputField}
                    label="Master Password"
                />
                <Button type="primary" htmlType="submit">
                    Login
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
    if (!values.secretKey) {
        errors.secretKey = 'Required';
    } else if (values.secretKey.length > 34) {
        errors.secretKey = 'Must be 34 characters or less';
    }
    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length > 64) {
        errors.password = 'Must be 64 characters or less';
    }
    return errors;
};

const LoginFormWrapper = connect(
    null,
    {
        submitLoginData,
    }
)(LoginForm);

export default reduxForm({
    form: 'login_form',
    validate,
})(LoginFormWrapper);
