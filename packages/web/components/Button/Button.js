import React from 'react';
import { Button as ButtonElement } from 'react-bootstrap';

const Button = props => {
    return <ButtonElement {...props}>{props.text}</ButtonElement>;
};

export default Button;
