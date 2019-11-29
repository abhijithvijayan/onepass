import React from 'react';
import styled from 'styled-components';

const HomeHolder = styled.div`
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    a {
        font-size: 1.5em;
    }
`;

const Home = () => (
    <HomeHolder>
        <h2>OnePass Password Manager</h2>
        <a href="/signup">SignUp</a>
        <a href="/login">Login</a>
    </HomeHolder>
);

export default Home;
