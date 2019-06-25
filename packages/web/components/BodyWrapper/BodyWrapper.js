import React, { Component } from 'react';

class BodyWrapper extends Component {
    render() {
        const { children } = this.props;
        return <main id="contents__holder">{children}</main>;
    }
}

export default BodyWrapper;
