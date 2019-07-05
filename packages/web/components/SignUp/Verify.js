import React from 'react';
import { Col, Row } from 'antd';
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
            <Row>
                <Col md={{ span: 10, offset: 8 }} className="pt-20">
                    <h2 className="text-center">Verify your OnePass account</h2>
                    <p className="pt-20">Enter your 6 digit verification token</p>
                    <VerifyForm />
                </Col>
            </Row>
        </VerifyContentsHolder>
    );
};

export default Verify;
