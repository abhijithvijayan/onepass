import React from 'react';
import { Button as ButtonElement } from 'antd';

const Button = props => {
    return <ButtonElement {...props}>{props.text}</ButtonElement>;
};

export default Button;
