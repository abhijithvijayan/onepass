import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Input, Button } from 'antd';

import { submitSRPVerifierOnSignUp } from '../../state/modules/auth/operations';

const renderInputField = ({ input, type, icon, label, meta: { touched, invalid, error } }) => {
    const isInvalid = touched && invalid;
    return (
        <Form.Item label={label} validateStatus={isInvalid ? 'error' : 'success'} help={isInvalid && error}>
            <Input {...input} type={type} prefix={<Icon type={icon} />} />
        </Form.Item>
    );
};

class MasterPasswordForm extends Component {
    onSubmit = ({ password }) => {
        const { userId, email } = this.props;
        this.props.submitSRPVerifierOnSignUp({ email, userId, password });
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Field
                    name="password"
                    type="password"
                    icon="lock"
                    component={renderInputField}
                    label="Enter a password"
                />
                <Field
                    name="confirmpassword"
                    type="password"
                    icon="lock"
                    component={renderInputField}
                    label="Confirm your password"
                />
                <Button type="primary" htmlType="submit">
                    Create OnePass account
                </Button>
            </Form>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 8) {
        errors.password = 'Master password must be atleast 8 characters.';
    }
    if (!values.confirmpassword) {
        errors.confirmpassword = 'Required';
    } else if (values.confirmpassword !== values.password) {
        errors.confirmpassword = "Passwords don't match.";
    }
    return errors;
};

const mapStateToProps = state => {
    const { signup } = state.auth;
    return {
        email: signup.response && signup.response.email,
        userId: signup.response && signup.response.userId,
    };
};

const MasterPasswordWrapper = connect(
    mapStateToProps,
    {
        submitSRPVerifierOnSignUp,
    }
)(MasterPasswordForm);

export default reduxForm({
    form: 'setMasterPassword_form',
    validate,
})(MasterPasswordWrapper);
