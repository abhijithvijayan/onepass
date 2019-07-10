/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/display-name */
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, change } from 'redux-form';
import { Cascader, Col, Form, Icon, Input } from 'antd';

/* eslint-disable-next-line arrow-body-style */
const renderField = ComponentToRender => ({
    input,
    ignore,
    type,
    children,
    icon,
    label,
    meta: { touched, invalid, error },
    ...rest
}) => {
    const isInvalid = touched && invalid;
    const prefix = icon ? <Icon type={icon} /> : undefined;
    const catType = type || undefined;
    // ignore providing unwanted props to cascader
    const storeProps = ignore ? undefined : { ...input };
    return (
        <Form.Item label={label} validateStatus={isInvalid ? 'error' : 'success'} help={isInvalid && error}>
            <ComponentToRender {...storeProps} type={catType} prefix={prefix} {...rest}>
                {children}
            </ComponentToRender>
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

    /* Manually update form cascader selector store value */
    handleSelectChange = selected => {
        this.props.changeStoreFormValue('item_modal_form.values.folder', 'selected');
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Field name="url" type="text" icon="link" component={renderInput} label="URL" />
                <Col md={{ span: 12 }}>
                    <Field name="name" type="text" component={renderInput} label="Name" />
                </Col>
                <Col md={{ span: 12 }}>
                    <Field name="folder" ignore component={renderSelect} label="Folder">
                        <Cascader
                            onChange={this.handleSelectChange}
                            options={cascaderOptions}
                            placeholder="Please select"
                        />
                    </Field>
                </Col>
                <Col md={{ span: 12 }}>
                    <Field name="username" type="text" icon="user" component={renderInput} label="Username" />
                </Col>
                <Col md={{ span: 12 }}>
                    <Field name="password" type="password" icon="lock" component={renderInput} label="Password" />
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

const mapDispatchToProps = dispatch => {
    return {
        changeStoreFormValue: bindActionCreators(change, dispatch),
    };
};

const ItemModalFormWrapper = connect(
    null,
    mapDispatchToProps
)(ItemModalForm);

export default reduxForm({
    form: 'item_modal_form',
    validate,
})(ItemModalFormWrapper);
