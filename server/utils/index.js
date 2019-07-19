exports.isAdmin = email => {
    return process.env.ADMIN_EMAILS.split(',')
        .map(e => {
            return e.trim();
        })
        .includes(email);
};
