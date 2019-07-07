import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from '../Loader';

class BodyWrapper extends Component {
    render() {
        const { children, isPageLoading } = this.props;
        const renderContent = isPageLoading ? <Loader /> : children;
        return <main>{renderContent}</main>;
    }
}

const mapStateToProps = ({ ui }) => {
    return {
        isPageLoading: ui.isPageLoading,
    };
};

export default connect(mapStateToProps)(BodyWrapper);
