import React from 'react';
import { Col, Row } from 'react-bootstrap';
import SideImage from './SideImage';
import LoginForm from './LoginForm';

const Login = () => {
    return (
        <Row>
            <Col md={8}>
                <SideImage />
            </Col>
            <Col md={4}>
                <LoginForm />
            </Col>
        </Row>
    );
};

export default Login;
