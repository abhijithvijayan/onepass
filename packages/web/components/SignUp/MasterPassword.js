import React from 'react';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

import '../../styles/base/_variables.scss';
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
            <Row className="d-center" style={{ height: '80%' }}>
                <Col md={4} className="pt-20">
                    <h2 className="text-center">Choose your Master Password</h2>
                    <MasterPasswordForm />
                </Col>
            </Row>
        </MasterPasswordContentsHolder>
    );
};

export default MasterPassword;
