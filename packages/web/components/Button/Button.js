import React from 'react';
import { Button as ButtonElement } from 'antd';

const Button = props => <ButtonElement {...props}>{props.text}</ButtonElement>;

export default Button;
