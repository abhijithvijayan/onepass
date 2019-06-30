import React, { Component } from 'react';
import styled from 'styled-components';

import BodyWrapper from '../components/BodyWrapper';

const ImageHolder = styled.div`
    height: 100vh;
    background-image: url('../../static/landing_bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;

class IndexPage extends Component {
    render() {
        return (
            <BodyWrapper>
                <ImageHolder />
            </BodyWrapper>
        );
    }
}

export default IndexPage;
