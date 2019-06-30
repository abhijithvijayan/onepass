const srp = require('secure-remote-password/client');

/**
 * Generates ecret/public ephemeral value pair
 */

export const genClientEphemeral = () => {
    const clientEphemeral = srp.generateEphemeral();
    return clientEphemeral;
};
