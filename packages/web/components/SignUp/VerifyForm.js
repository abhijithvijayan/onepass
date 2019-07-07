import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { Button, Form, Icon, Input } from 'antd';

import { submitVerificationToken } from '../../state/modules/auth/operations';

const renderInputField = ({ input, type, icon, label, meta: { touched, invalid, error } }) => {
    const isInvalid = touched && invalid;
    return (
        <Form.Item label={label} validateStatus={isInvalid ? 'error' : 'success'} help={isInvalid && error}>
            <Input {...input} type={type} prefix={<Icon type={icon} />} />
        </Form.Item>
    );
};

class VerifyForm extends Component {
    onSubmit = ({ verificationToken }) => {
        const { email } = this.props;
        this.props.submitVerificationToken({ email, verificationToken });
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Field
                    name="verificationToken"
                    type="number"
                    icon="number"
                    component={renderInputField}
                    label="Token"
                />
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.verificationToken) {
        errors.verificationToken = 'Required';
        // eslint-disable-next-line no-restricted-globals
    } else if (isNaN(Number(values.verificationToken))) {
        errors.verificationToken = 'Must be a number';
    } else if (values.verificationToken.length > 6) {
        errors.verificationToken = 'Token Code too long';
    }
    return errors;
};

const mapStateToProps = state => {
    const { signup } = state.auth;
    return {
        email: signup.response.email,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        submitVerificationToken: bindActionCreators(submitVerificationToken, dispatch),
    };
};

const VerifyFormWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(VerifyForm);

export default reduxForm({
    form: 'verify_form',
    validate,
})(VerifyFormWrapper);
