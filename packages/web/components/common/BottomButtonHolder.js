import React from 'react';
import { Button } from 'antd';
import Router from 'next/router';
import styled from 'styled-components';

const ButtonHolder = styled.div`
    display: flex;
    padding-top: 1em;
    justify-content: space-between;
    align-items: baseline;
`;

const BottomButtonHolder = props => {
    return (
        <ButtonHolder>
            <p>{props.text}</p>
            <Button
                onClick={() => {
                    return Router.push(`${props.route}`);
                }}
            >
                {props.buttonText}
            </Button>
        </ButtonHolder>
    );
};

export default BottomButtonHolder;
