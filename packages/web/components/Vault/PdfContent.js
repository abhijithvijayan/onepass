import React from 'react';
import { beautifySecretKey } from '@onepass/core/common';

const PdfContent = props => {
    const today = new Date();
    const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    return (
        <div>
            <h2>OnePass Emergency Kit</h2>
            <p style={{ textAlign: 'center' }}>
                Generated for {props.name} on {date}
            </p>
            <br />
            <p>The secret key is to be used with master password on login.</p>
            <ul>
                <li>1. Print out this document (and/or put it on a USB key or external drive).</li>
                <li>2. Store your kit in a secure place where you can find it, e.g. a safe deposit box.</li>
            </ul>
            <div>
                <ul>
                    <li>
                        SIGN-IN ADDRESS <br /> {props.server}
                    </li>
                    <li>
                        EMAIL ADDRESS <br /> {props.email}
                    </li>
                    <li>
                        SECRET KEY <br /> {beautifySecretKey(props.secretKey)}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default PdfContent;
