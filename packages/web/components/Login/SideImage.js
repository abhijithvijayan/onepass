import React from 'react';
import styled from 'styled-components';

const ImageHolder = styled.div`
    height: 100vh;
    background-image: url('../../static/langing_bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;

const SideImage = () => {
    return <ImageHolder />;
};

export default SideImage;
