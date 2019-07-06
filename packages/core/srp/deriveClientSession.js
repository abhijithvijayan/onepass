const srp = require('secure-remote-password/client');

export const deriveClientSession = ({ salt, privateKey, userId, clientSecretEphemeral, serverPublicEphemeral }) => {
    const privateKeyForSRP = privateKey.toString('hex');
    const clientSession = srp.deriveSession(
        clientSecretEphemeral,
        serverPublicEphemeral,
        salt,
        userId,
        privateKeyForSRP
    );
    return clientSession;
};

export const verifyLoginSession = (clientPublicEphemeral, clientSession, serverSessionProof) => {
    srp.verifySession(clientPublicEphemeral, clientSession, serverSessionProof);
};
