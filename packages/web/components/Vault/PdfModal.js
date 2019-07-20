import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';
import styled from 'styled-components';

import { beautifySecretKey } from '@onepass/core/common';
import { getEmergencyKit } from '../../state/modules/auth/operations';
import PdfContent from './PdfContent';

// Do Not Import in Server
let JSPDF = null;
if (typeof window !== 'undefined') {
    import('jspdf').then(module => {
        JSPDF = module.default;
    });
}

const SecretKeyHolder = styled.div`
    line-height: 1.8rem;
    font-size: 1.3rem;
    color: #7a8a99;
    letter-spacing: 0.1em;
`;

class PdfModal extends Component {
    handleDownloadClick() {
        const { email, secretKey, server, name } = this.props;
        const string = renderToString(<PdfContent email={email} name={name} secretKey={secretKey} server={server} />);
        const pdf = new JSPDF('p', 'mm', 'a4');
        pdf.fromHTML(string);
        pdf.save('OnePass Emergency Kit');
        // ToDo: Check status of download
        // Send server request
        this.props.getEmergencyKit();
    }

    renderModal() {
        const { hasDownloadedEmergencyKit, secretKey } = this.props;

        return (
            <Modal style={{ top: 200 }} closable={false} visible={!hasDownloadedEmergencyKit} footer={null}>
                <h2>Meet your Secret Key</h2>
                <p>You’ll need it to sign in on new devices.</p>
                <div>
                    <SecretKeyHolder>{beautifySecretKey(secretKey)}</SecretKeyHolder>
                    <Button
                        type="button"
                        onClick={() => {
                            return this.handleDownloadClick();
                        }}
                    >
                        Download
                    </Button>
                </div>
                <h3>Click Download to save an Emergency Kit which contains your Secret Key.</h3>
                <p>
                    We can’t recover your Secret Key for you. If you lose it, you won’t be able to sign in to your
                    account
                </p>
            </Modal>
        );
    }

    render() {
        return this.renderModal();
    }
}

const mapStateToProps = ({ auth: { login } }) => {
    const { decrypted, user } = login;
    return {
        email: user.email,
        name: user.name,
        secretKey: decrypted.keys.secretKey,
        server: user.server,
        hasDownloadedEmergencyKit: user.hasDownloadedEmergencyKit,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getEmergencyKit: bindActionCreators(getEmergencyKit, dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PdfModal);
