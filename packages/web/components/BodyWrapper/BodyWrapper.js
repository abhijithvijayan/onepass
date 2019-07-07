import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import Loader from '../Loader';
import { hidePageLoader } from '../../state/modules/common/ui/operations';

const Wrapper = styled.main`
    position: relative;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    min-height: 100vh;
    width: 100%;
`;

class BodyWrapper extends Component {
    componentDidMount() {
        this.props.hidePageLoader();
    }

    render() {
        const { children, isPageLoading } = this.props;
        const renderContent = isPageLoading ? <Loader /> : children;
        return (
            <Wrapper>
                <ContentWrapper>{renderContent}</ContentWrapper>
            </Wrapper>
        );
    }
}

const mapStateToProps = ({ ui }) => {
    return {
        isPageLoading: ui.isPageLoading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        hidePageLoader: bindActionCreators(hidePageLoader, dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BodyWrapper);
