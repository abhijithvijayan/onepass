import React from 'react';
import styled from 'styled-components';

const LogoText = styled.div`
    color: #fff;
    font-size: 1.2em;
    padding: 10px 5px 20px 5px;
`;

const SideBarHeader = () => <LogoText className="logo">OnePass</LogoText>;

export default SideBarHeader;
