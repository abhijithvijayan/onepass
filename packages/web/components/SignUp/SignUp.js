import React from 'react';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

import '../../styles/base/_variables.scss';
import SignUpForm from './SignUpForm';
import BottomButtonHolder from '../common/BottomButtonHolder';

const SignUpContentsHolder = styled.div`
    height: 100vh;
    color: ${props => {
        return props.theme.pink;
    }};
`;

const SignUp = () => {
    return (
        <SignUpContentsHolder>
            <Row className="d-center" style={{ height: '80%' }}>
                <Col md={4} className="pt-20">
                    <h2 className="text-center">SignUp</h2>
                    <SignUpForm />
                    <BottomButtonHolder route="/login" buttonText="LOGIN NOW" text="Already have an account?" />
                </Col>
            </Row>
        </SignUpContentsHolder>
    );
};

export default SignUp;
