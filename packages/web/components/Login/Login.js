import React from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import styled from 'styled-components';
import Router from 'next/router';

import '../../styles/base/_variables.scss';
import LoginForm from './LoginForm';
import LoginCarousel from './LoginCarousel';

const LoginContentsHolder = styled.div`
    height: 100vh;
    color: ${props => {
        return props.theme.pink;
    }};
`;

const Login = () => {
    return (
        <LoginContentsHolder>
            <Row>
                <Col md={6} className="pt-20" style={{ paddingLeft: '5vh' }}>
                    <h2 className="text-center">Login</h2>
                    <LoginForm />
                    <p className="pt-20">Don't have account?</p>
                    <Button
                        onClick={() => {
                            return Router.push('/signup');
                        }}
                    >
                        JOIN NOW
                    </Button>
                </Col>
                <Col md={6}>{/* <LoginCarousel /> */}</Col>
            </Row>
        </LoginContentsHolder>
    );
};

export default Login;
