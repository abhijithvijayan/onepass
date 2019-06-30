const srp = require('secure-remote-password/client');

export const deriveSession = (salt, userId, password, clientSecretEphemeral, serverPublicEphemeral) => {
    const privateKey = srp.derivePrivateKey(salt, userId, password);
    const clientSession = srp.deriveSession(clientSecretEphemeral, serverPublicEphemeral, salt, userId, privateKey);
    return clientSession;
};
