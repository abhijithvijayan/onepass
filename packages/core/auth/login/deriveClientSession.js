const srp = require('secure-remote-password/client');

export const deriveClientSession = (salt, userId, password, clientSecretEphemeral, serverPublicEphemeral) => {
    const privateKey = srp.derivePrivateKey(salt, userId, password);
    const clientSession = srp.deriveSession(clientSecretEphemeral, serverPublicEphemeral, salt, userId, privateKey);
    return clientSession;
};

export const verifyLoginSession = (clientPublicEphemeral, clientSession, serverSessionProof) => {
    srp.verifySession(clientPublicEphemeral, clientSession, serverSessionProof);
};
