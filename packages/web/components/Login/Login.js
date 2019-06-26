import React from 'react';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

import LoginForm from './LoginForm';
import LoginCarousel from './LoginCarousel';

const LoginContentsHolder = styled.div`
    height: 100vh;
`;

const Login = () => {
    return (
        <LoginContentsHolder>
            <Row>
                <Col md={6}>
                    <LoginForm />
                </Col>
                <Col md={6}>
                    <LoginCarousel />
                </Col>
            </Row>
        </LoginContentsHolder>
    );
};

export default Login;
