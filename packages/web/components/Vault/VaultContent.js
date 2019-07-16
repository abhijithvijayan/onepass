/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Empty } from 'antd';

import VaultItemCard from './VaultItemCard';

const MainContentHolder = styled.div`
    padding-top: 25px;
    overflow: hidden;
    z-index: 1;
    display: flex;
    flex-direction: column;
`;

const VaultItemsScroll = styled.div`
    overflow: auto;
`;

const FolderWrapper = styled.div`
    min-height: 85vh;
    display: block;
`;

const Folder = styled.div`
    margin: 0 15px 24px;
    @media screen and (min-width: ${props => {
            return props.theme.screenXsMax;
        }}) {
        margin: 0 75px 24px 48px;
    }
`;

const FolderHead = styled.div`
    color: #4d5e6e;
    font-size: 15px;
    position: relative;
    line-height: 36px;
    border-bottom: 1px solid #d2d4d5;
`;

const FolderContents = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    position: relative;
    background: ${props => {
        return props.theme.grayWhite;
    }};
    padding: 10px;
    @media screen and (min-width: ${props => {
            return props.theme.screenXsMax;
        }}) {
        padding: 30px;
    }
`;

const EmptyHolder = styled(Empty)`
    min-height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    flex-direction: column;
`;

class VaultContent extends Component {
    renderItemCard(key, item) {
        return <VaultItemCard item={item} key={key} />;
    }

    renderFolder() {
        const { items } = this.props;
        return (
            <Folder>
                <FolderHead>
                    {/* To Do some toggle button here */}
                    <div>Social</div>
                </FolderHead>
                <FolderContents>
                    {Object.entries(items).map(item => {
                        return this.renderItemCard(item[0], item[1]);
                    })}
                </FolderContents>
            </Folder>
        );
    }

    render() {
        const { itemsCount } = this.props;
        return (
            <React.Fragment>
                <MainContentHolder>
                    <VaultItemsScroll>
                        <FolderWrapper>{itemsCount > 0 ? this.renderFolder() : <EmptyHolder />}</FolderWrapper>
                    </VaultItemsScroll>
                    {/* <EmptyHolder /> */}
                </MainContentHolder>
            </React.Fragment>
        );
    }
}

const mapStateToProps = ({ vault: { decrypted } }) => {
    const { itemsCount } = decrypted;
    if (itemsCount !== 0) {
        return {
            items: decrypted.items,
            itemsCount,
        };
    }
    return {
        itemsCount,
        items: {},
    };
};

export default connect(mapStateToProps)(VaultContent);
