import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const Title = styled.h2`
  font-size: 2em;
  text-align: center;
  color: black;
`;

const Wrapper = styled.section`
  padding: 4em;
  background: rgba(255, 255, 255, 0.8);
`;

class IndexPage extends Component {
  render() {
    return (
      <Wrapper>
        <Title>OnePass Password Manager</Title>
      </Wrapper>
    );
  };
}

export default connect()(IndexPage);