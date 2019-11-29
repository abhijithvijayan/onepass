exports.isAdmin = email =>
    process.env.ADMIN_EMAILS.split(',')
        .map(e => e.trim())
        .includes(email);
