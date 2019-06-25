import React from 'react';
import { Col, Row } from 'react-bootstrap';

import LoginForm from './LoginForm';

const Login = () => {
    return (
        <Row>
            <Col md={12}>
                <LoginForm />
            </Col>
        </Row>
    );
};

export default Login;
