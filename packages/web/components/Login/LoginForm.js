import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Button } from 'react-bootstrap';

import { genClientEphemeral } from '@onepass/core/auth';
import { submitLoginData } from '../../state/modules/auth/operations';

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => {
    return (
        <Form.Group controlId={label}>
            <Form.Label>{label}</Form.Label>
            <Form.Control {...input} type={type} />
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </Form.Group>
    );
};

class LoginForm extends Component {
    onSubmit = formValues => {
        const clientEphemeral = genClientEphemeral();
        this.props.submitLoginData(formValues, clientEphemeral);
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Field name="email" type="email" component={renderField} label="Email" />
                <Field name="secretKey" type="text" component={renderField} label="Secret Key" />
                <Field name="password" type="password" component={renderField} label="Master Password" />
                <Button variant="primary" type="submit">
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
