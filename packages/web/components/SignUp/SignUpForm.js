import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Button } from 'react-bootstrap';

import { submitSignUpData } from '../../state/modules/auth/operations';

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => {
    return (
        <Form.Group controlId={label}>
            <Form.Label>{label}</Form.Label>
            <Form.Control {...input} type={type} />
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </Form.Group>
    );
};

class SignUpForm extends Component {
    onSubmit = formValues => {
        // eslint-disable-next-line no-console
        console.log(formValues);
        this.props.submitSignUpData(formValues);
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Field name="name" type="text" component={renderField} label="Name" />
                <Field name="email" type="email" component={renderField} label="Email" />
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
