import React from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import styled from 'styled-components';
import Router from 'next/router';

import '../../styles/base/_variables.scss';
import SignUpForm from './SignUpForm';

const SignUpContentsHolder = styled.div`
    height: 100vh;
    color: ${props => {
        return props.theme.pink;
    }};
`;

const SignUp = () => {
    return (
        <SignUpContentsHolder>
            <Row>
                <Col md={6} className="pt-20" style={{ paddingLeft: '5vh' }}>
                    <h2 className="text-center">SignUp</h2>
                    <SignUpForm />
                    <p>Already have an account?</p>
                    <Button
                        onClick={() => {
                            return Router.push('/login');
                        }}
                    >
                        LOGIN NOW
                    </Button>
                </Col>
                <Col md={6}>
                    <div></div>
                </Col>
            </Row>
        </SignUpContentsHolder>
    );
};

export default SignUp;
