/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/display-name */
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { Button, Form, Icon, Input, Tooltip } from 'antd';

import { submitLoginData } from '../../state/modules/auth/operations';

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

class LoginForm extends Component {
    onSubmit = ({ email, password, secretKey }) => {
        this.props.submitLoginData({ email, password, secretKey: secretKey.toUpperCase() });
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Field name="email" type="email" icon="mail" component={renderInput} label="Email" />
                <Field
                    name="secretKey"
                    type="text"
                    icon="key"
                    component={renderInput}
                    suffix={
                        <Tooltip title="This is your 34 digit secret key">
                            <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                    label="Secret Key"
                />
                <Field
                    name="password"
                    type="password"
                    icon="lock"
                    component={renderPasswordInput}
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
    } else if (values.secretKey.length > 40) {
        errors.secretKey = 'Must be 40 characters or less';
    }
    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 10) {
        errors.password = 'Master password must be atleast 10 characters.';
    } else if (values.password.length > 64) {
        errors.password = 'Must be 64 characters or less';
    }
    return errors;
};

const mapDispatchToProps = dispatch => {
    return {
        submitLoginData: bindActionCreators(submitLoginData, dispatch),
    };
};

const LoginFormWrapper = connect(
    null,
    mapDispatchToProps
)(LoginForm);

export default reduxForm({
    form: 'login_form',
    validate,
})(LoginFormWrapper);
