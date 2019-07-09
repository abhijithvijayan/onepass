import React from 'react';
import styled from 'styled-components';
import { Icon, Tooltip } from 'antd';

const Card = styled.div`
    user-select: none;
    transition: all 0.3s;
    font-family: ${props => {
        return props.theme.opensans;
    }};
    border-radius: 12px;
    height: 100px;
    min-height: 300px;
    background: #fff;
    font-size: 14px;
    line-height: 1.5;
    padding: 17px 22px;
    margin: 0;
    position: relative;
    &:hover {
        transform: translateY(-8px);
    }
`;

const SiteName = styled.h2`
    padding-bottom: 13px;
    color: ${props => {
        return props.theme.pink;
    }};
    font-size: 1.6rem;
    font-family: ${props => {
        return props.theme.nunito;
    }};
    font-weight: ${props => {
        return props.theme.bold;
    }};
    text-transform: capitalize;
    margin: 0px;
    letter-spacing: 1px;
`;

const SiteUrl = styled.p`
    color: rgba(0, 0, 0, 0.7);
    font-size: 0.8rem;
    line-height: 1.5;
    margin-bottom: 0;
    padding-bottom: 1.25rem;
    font-weight: 400;
    overflow: hidden;
`;

const DataHolder = styled.div`
    border-left: 1px solid rgba(0, 0, 0, 0.25);
    .data__column {
        position: relative;
        &::before {
            position: absolute;
            content: '●';
            color: rgba(0, 0, 0, 0.5);
            transform: translate(-5px, -1px);
            height: 100%;
            display: flex;
            font-size: 15px;
            align-items: center;
        }
        div {
            margin-left: 22px;
            h2 {
                color: ${props => {
                    return props.theme.lightPink;
                }};
                font-weight: ${props => {
                    return props.theme.bold;
                }};
                font-size: 1.1rem;
                margin-bottom: 0;
                pointer-events: none;
            }
            p {
                font-size: 0.9rem;
                margin-bottom: 0;
                padding-bottom: 0.95em;
            }
        }
    }
`;

const IconHolder = styled.div`
    display: flex;
    justify-content: space-around;
    .anticon {
        font-size: 18px;
        padding: 8px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.5);
        &:hover {
            color: ${props => {
                return props.theme.pink;
            }};
        }
    }
`;

const renderTooltipIcons = (placement, title, type) => {
    return (
        <Tooltip placement={placement} title={title}>
            <Icon type={type} />
        </Tooltip>
    );
};

const VaultItemCard = () => {
    return (
        <Card>
            <div>
                <SiteName>Google</SiteName>
            </div>
            <SiteUrl>https://www.google.com</SiteUrl>
            <DataHolder>
                <div className="data__column">
                    <div>
                        <h2>Username</h2>
                        <p>onepass</p>
                    </div>
                </div>
                <div className="data__column">
                    <div>
                        <h2>Password</h2>
                        <p>**********</p>
                    </div>
                </div>
            </DataHolder>
            <IconHolder>
                {renderTooltipIcons('bottomLeft', 'Delete', 'delete')}
                {renderTooltipIcons('bottom', 'Edit', 'edit')}
                {renderTooltipIcons('bottomRight', 'Launch', 'rocket')}
            </IconHolder>
        </Card>
    );
};

export default VaultItemCard;
