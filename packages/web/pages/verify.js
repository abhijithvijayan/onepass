import React, { Component } from 'react';
import { connect } from 'react-redux';

import BodyWrapper from '../components/BodyWrapper';
import Verify from '../components/SignUp/Verify';

class VerifyPage extends Component {
    render() {
        return (
            <BodyWrapper>
                <Verify />
            </BodyWrapper>
        );
    }
}

export default connect()(VerifyPage);
