import React, { Component } from 'react';
import { connect } from 'react-redux';

class Index extends Component {
  render() {
    return <div>OnePass Password Manager</div>;
  };
}

export default connect()(Index);