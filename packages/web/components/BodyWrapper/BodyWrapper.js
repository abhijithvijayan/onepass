import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { hidePageLoader as hidePageLoaderOperation } from '../../state/modules/common/ui/operations';
import Loader from '../Loader';
import ToastNotifier from '../common/ToastNotifier';

const Wrapper = styled.main`
    position: relative;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    min-height: 100vh;
    width: 100%;
`;

const BodyWrapper = ({ children, isPageLoading, hidePageLoader }) => {
    useEffect(() => {
        hidePageLoader();
    });

    const renderContent = isPageLoading ? <Loader /> : children;

    return (
        <Wrapper>
            <ToastNotifier />
            <ContentWrapper>{renderContent}</ContentWrapper>
        </Wrapper>
    );
};

const mapStateToProps = ({ ui }) => ({
    isPageLoading: ui.isPageLoading,
});

const mapDispatchToProps = dispatch => ({
    hidePageLoader: bindActionCreators(hidePageLoaderOperation, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BodyWrapper);
