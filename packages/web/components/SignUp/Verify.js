import React from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import styled from 'styled-components';

import '../../styles/base/_variables.scss';
import VerifyForm from './VerifyForm';

const VerifyContentsHolder = styled.div`
    height: 100vh;
    color: ${props => {
        return props.theme.pink;
    }};
`;

const Verify = () => {
    return (
        <VerifyContentsHolder>
            <Row className="d-center" style={{ height: '80%' }}>
                <Col md={4} className="pt-20">
                    <h2 className="text-center">Verify your OnePass account</h2>
                    <p className="pt-20">Enter your 6 digit verification token</p>
                    <VerifyForm />
                </Col>
            </Row>
        </VerifyContentsHolder>
    );
};

export default Verify;
