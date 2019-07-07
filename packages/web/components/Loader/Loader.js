import React from 'react';
import styled from 'styled-components';

const LoadingWrapper = styled.div`
    flex: 1 1 auto;
    flex-basis: 250px;
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: center;
`;

const Loader = () => {
    return <LoadingWrapper>Loading</LoadingWrapper>;
};

export default Loader;
