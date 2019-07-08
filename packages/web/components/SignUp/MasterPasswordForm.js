import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { Button, Form } from 'antd';

import ReactPasswordStrength from 'react-password-strength/dist/universal';
import styled from 'styled-components';

import { completeSignUp } from '../../state/modules/auth/operations';

const FormInputHolder = styled.div`
    display: flex;
    .password__strength--input {
        width: 100%;
        margin-bottom: 5px;
        input {
            width: calc(85% - 18px);
            padding-left: 38px;
        }
        span {
            padding-right: 4px;
            padding: 16px 8px 16px 5px;
            font-size: 14px;
            width: auto;
        }
    }
`;

const PrefixIconHolder = styled.span`
    position: absolute;
    z-index: 1;
    padding: 6px 12px;
    left: 0;
`;

const renderInputField = ({ input, label, meta: { touched, invalid, error } }) => {
    const isInvalid = touched && invalid;
    return (
        <Form.Item label={label} validateStatus={isInvalid ? 'error' : 'success'} help={isInvalid && error}>
            <FormInputHolder>
                <PrefixIconHolder className="ant-input-prefix">
                    <i aria-label="icon: lock" className="anticon anticon-lock">
                        <svg
                            viewBox="64 64 896 896"
                            focusable="false"
                            className=""
                            data-icon="lock"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 1 0-56 0z"></path>
                        </svg>
                    </i>
                </PrefixIconHolder>
                <ReactPasswordStrength
                    inputProps={{ ...input }}
                    className="password__strength--input"
                    minLength={10}
                    minScore={4}
                    scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
                />
            </FormInputHolder>
        </Form.Item>
    );
};

class MasterPasswordForm extends Component {
    onSubmit = ({ password }) => {
        const { userId, versionCode, email } = this.props;
        this.props.completeSignUp({ email, userId, versionCode, password });
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Field name="password" icon="lock" component={renderInputField} label="Enter a password" />
                <Field name="confirmpassword" icon="lock" component={renderInputField} label="Confirm your password" />
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
    } else if (values.password.length < 10) {
        errors.password = 'Master password must be atleast 10 characters.';
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
        versionCode: signup.response && signup.response.versionCode,
        userId: signup.response && signup.response.userId,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        completeSignUp: bindActionCreators(completeSignUp, dispatch),
    };
};

const MasterPasswordWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(MasterPasswordForm);

export default reduxForm({
    form: 'setMasterPassword_form',
    validate,
})(MasterPasswordWrapper);
