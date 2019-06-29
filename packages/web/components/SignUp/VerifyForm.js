import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Button } from 'react-bootstrap';

import { submitVerificationToken } from '../../state/modules/auth/operations';

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => {
    return (
        <Form.Group controlId={label}>
            <Form.Control {...input} type={type} placeholder={label} />
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </Form.Group>
    );
};

class VerifyForm extends Component {
    onSubmit = formValues => {
        // eslint-disable-next-line no-console
        console.log(formValues);
        // ToDo: pass in the email
        this.props.submitVerificationToken(formValues);
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Field name="verifyToken" type="text" component={renderField} label="Token" />
                <Button variant="primary" type="submit">
                    Verify
                </Button>
            </Form>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.verifyToken) {
        errors.verifyToken = 'Required';
        // eslint-disable-next-line no-restricted-globals
    } else if (isNaN(Number(values.verifyToken))) {
        errors.verifyToken = 'Must be a number';
    } else if (values.verifyToken.length > 6) {
        errors.verifyToken = 'Token Code too long';
    }
    return errors;
};

const VerifyFormWrapper = connect(
    null,
    {
        submitVerificationToken,
    }
)(VerifyForm);

export default reduxForm({
    form: 'verify_form',
    validate,
})(VerifyFormWrapper);
