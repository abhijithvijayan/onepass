import srpClient from 'secure-remote-password/client';
import { array2hex } from '../common';

export const deriveClientSession = ({ salt, privateKey, userId, clientSecretEphemeral, serverPublicEphemeral }) => {
    const privateKeyForSRP = array2hex(privateKey);
    const clientSession = srpClient.deriveSession(
        clientSecretEphemeral,
        serverPublicEphemeral,
        salt,
        userId,
        privateKeyForSRP
    );
    return clientSession;
};

export const verifyLoginSession = (clientPublicEphemeral, clientSession, serverSessionProof) => {
    srpClient.verifySession(clientPublicEphemeral, clientSession, serverSessionProof);
};
