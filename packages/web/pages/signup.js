import React, { Component } from 'react';
import { connect } from 'react-redux';

import SignUp from '../components/SignUp';
import BodyWrapper from '../components/BodyWrapper';

class SignUpPage extends Component {
    render() {
        return (
            <BodyWrapper>
                <SignUp />
            </BodyWrapper>
        );
    }
}

export default connect()(SignUpPage);
