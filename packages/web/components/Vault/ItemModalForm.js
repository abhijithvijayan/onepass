/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/display-name */
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Cascader, Col, Form, Icon, Input } from 'antd';

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

const cascaderOptions = [
    {
        value: 'business',
        label: 'ABusiness',
        children: [
            {
                value: 'company',
                label: 'ACompany',
            },
        ],
    },
    {
        value: 'social',
        label: 'Social',
    },
];

const renderInput = renderField(Input);
const renderSelect = renderField(Cascader);

class ItemModalForm extends Component {
    onSubmit = ({ name }) => {
        /* eslint-disable-next-line no-console */
        console.log('modal form submitted');
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Field label="URL" name="url" type="text" icon="link" component={renderInput} />
                <Col md={{ span: 12 }}>
                    <Field label="Name" name="name" type="text" component={renderInput} />
                </Col>
                {/* To Be Fixed - ref: https://github.com/erikras/redux-form/issues/4503 */}
                <Col md={{ span: 12 }}>
                    <Field
                        options={cascaderOptions}
                        placeholder="Please select"
                        label="Folder"
                        name="folder"
                        component={renderSelect}
                    />
                </Col>
                <Col md={{ span: 12 }}>
                    <Field label="Username" name="username" type="text" icon="user" component={renderInput} />
                </Col>
                <Col md={{ span: 12 }}>
                    <Field label="Password" name="password" type="password" icon="lock" component={renderInput} />
                </Col>
            </Form>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.name) {
        errors.name = 'Required';
    }
    return errors;
};

const ItemModalFormWrapper = connect()(ItemModalForm);

export default reduxForm({
    form: 'item_modal_form',
    validate,
})(ItemModalFormWrapper);
