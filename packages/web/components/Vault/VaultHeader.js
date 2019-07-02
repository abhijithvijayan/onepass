import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import Router from 'next/router';

import Button from '../Button';
import { logoutUser } from '../../state/modules/auth/actions';

class VaultHeader extends Component {
    handleButtonClick() {
        const { isAuthenticated } = this.props;
        if (isAuthenticated) {
            this.props.logoutUser();
        } else {
            Router.push('/login');
        }
    }

    renderButtonText() {
        const { isAuthenticated } = this.props;
        return isAuthenticated ? 'logout' : 'login';
    }

    render() {
        return (
            <Container style={{ paddingTop: '5vh' }}>
                <Button
                    onClick={() => {
                        return this.handleButtonClick();
                    }}
                    text={this.renderButtonText()}
                />
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.login.isAuthenticated,
    };
};

export default connect(
    mapStateToProps,
    { logoutUser }
)(VaultHeader);
