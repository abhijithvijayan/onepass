import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';

const { Footer } = Layout;

const FooterHolder = styled(Footer)`
    padding: 17px 50px !important;
    text-align: center;
`;

const VaultFooter = () => <FooterHolder>OnePass © 2019</FooterHolder>;

export default VaultFooter;
