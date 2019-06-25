import React, { Component } from 'react';

class BodyWrapper extends Component {
    render() {
        const { children } = this.props;
        return <main>{children}</main>;
    }
}

export default BodyWrapper;
