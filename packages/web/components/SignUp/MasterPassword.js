import React from 'react';
import { Col, Row } from 'antd';
import styled from 'styled-components';

import MasterPasswordForm from './MasterPasswordForm';

const MasterPasswordContentsHolder = styled.div`
    height: 100vh;
    color: ${props => {
        return props.theme.pink;
    }};
`;

const MasterPassword = () => {
    return (
        <MasterPasswordContentsHolder>
            <Row>
                <Col md={{ span: 8, offset: 8 }} className="pt-20">
                    <h2 className="text-center">Choose your Master Password</h2>
                    <MasterPasswordForm />
                </Col>
            </Row>
        </MasterPasswordContentsHolder>
    );
};

export default MasterPassword;
