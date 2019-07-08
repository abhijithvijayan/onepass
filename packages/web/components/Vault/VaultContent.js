import React from 'react';
import styled from 'styled-components';
import { Empty } from 'antd';

import VaultItemCard from './VaultItemCard';

const ContentHolder = styled.div`
    min-height: 85vh;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 30px;
    position: relative;
    background: ${props => {
        return props.theme.grayWhite;
    }};
`;

const EmptyHolder = styled(Empty)`
    min-height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    flex-direction: column;
`;

const VaultContent = () => {
    return (
        <React.Fragment>
            <ContentHolder>
                <VaultItemCard />
                <VaultItemCard />
                <VaultItemCard />
                <VaultItemCard />
                <VaultItemCard />
            </ContentHolder>
            {/* <EmptyHolder /> */}
        </React.Fragment>
    );
};

export default VaultContent;
