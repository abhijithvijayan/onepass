import React from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';

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
            <Row>
                <Col md={{ span: 10, offset: 8 }} className="pt-20">
                    <h2 className="text-center">SignUp</h2>
                    <SignUpForm />
                    <BottomButtonHolder route="/login" buttonText="LOGIN NOW" text="Already have an account?" />
                </Col>
            </Row>
        </SignUpContentsHolder>
    );
};

export default SignUp;
