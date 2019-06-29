import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Button } from 'react-bootstrap';

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => {
    return (
        <Form.Group controlId={label}>
            <Form.Label>{label}</Form.Label>
            <Form.Control {...input} type={type} />
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </Form.Group>
    );
};

class MasterPasswordForm extends Component {
    onSubmit = formValues => {
        // eslint-disable-next-line no-console
        console.log(formValues);
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Field name="password" type="password" component={renderField} label="Enter a password" />
                <Field name="confirmpassword" type="password" component={renderField} label="Confirm your password" />
                <Button variant="primary" type="submit">
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

const MasterPasswordWrapper = connect()(MasterPasswordForm);

export default reduxForm({
    form: 'setMasterPassword_form',
    validate,
})(MasterPasswordWrapper);
