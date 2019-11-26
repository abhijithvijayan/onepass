import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Vault from '@onepass/web/components/Vault';
import BodyWrapper from '@onepass/web/components/BodyWrapper';

const VaultPage = ({
    isAuthenticated,
    history
}) => {
    useEffect(() => {
        if (!isAuthenticated) history.push('/login');
    }, [isAuthenticated, history]);

    return (
        isAuthenticated && (
            <BodyWrapper>
                <Vault />
            </BodyWrapper>
        )
    );
}

const mapStateToProps = ({ auth: { login } }) => {
    return {
        isAuthenticated: login.isAuthenticated,
    };
};

export default connect(mapStateToProps)(VaultPage);
