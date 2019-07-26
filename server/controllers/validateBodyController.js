const validator = require('express-validator');
const { validationResult } = require('express-validator');

/* SignUp Form */
exports.signUpValidationCriterias = [
    validator
        .body('email')
        .exists()
        .withMessage('You must provide a valid email address.')
        .isLength({ max: 254 })
        .withMessage('Email must be 254 characters or less.')
        .isEmail()
        .withMessage('Email address you entered is not valid.')
        .trim()
        .normalizeEmail(),
    validator
        .body('name')
        .exists()
        .withMessage('You must provide your name.')
        .isLength({ max: 64 })
        .withMessage('Name must be 64 characters or less.'),
];

exports.signUpValidationBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const emailError = errorsObj.email && errorsObj.email.msg;
        const nameError = errorsObj.name && errorsObj.name.msg;
        return res.status(400).json({
            error: {
                msg: emailError || nameError,
                reportedAt: new Date().getTime(),
            },
        });
    }
    return next();
};

/* Email - Verification Token */
exports.emailVerificationCriterias = [
    validator
        .body('email')
        .exists()
        .withMessage('No email address found.')
        .isLength({ max: 254 })
        .withMessage('Email must be 254 characters or less.')
        .isEmail()
        .withMessage('Email address you entered is not valid.')
        .trim()
        .normalizeEmail(),
    validator
        .body('verificationToken')
        .exists()
        .withMessage('No valid verification token.')
        .matches(/^[0-9]+$/)
        .withMessage('Verification token must be a number.')
        .isLength({ min: 6, max: 6 })
        .withMessage('Verification token must be 6 characters long.'),
];

exports.emailVerificationBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const emailError = errorsObj.email && errorsObj.email.msg;
        const tokenError = errorsObj.verificationToken && errorsObj.verificationToken.msg;
        return res.status(400).json({
            error: {
                msg: emailError || tokenError,
                reportedAt: new Date().getTime(),
            },
        });
    }
    return next();
};

exports.finalizeAccountValidationCriterias = [
    validator
        .body('email')
        .exists()
        .withMessage('No email address found.')
        .isLength({ max: 254 })
        .withMessage('Email must be 254 characters or less.')
        .isEmail()
        .withMessage('Email address you entered is not valid.')
        .trim()
        .normalizeEmail(),
    validator
        .body('userId')
        .exists()
        .withMessage('No valid userId found.')
        .isLength({ min: 13 })
        .withMessage('User id must be 13 characters or more.'),
    validator
        .body('salt')
        .exists()
        .withMessage('No valid salt found.'),
    validator
        .body('verifier')
        .exists()
        .withMessage('No valid verifier found.'),
    validator
        .body('encryptionKeys')
        .exists()
        .withMessage('No valid encryption keys found.'),
    validator
        .body('encryptionKeys.pubKey')
        .exists()
        .withMessage('No valid encrypted public key param found.'),
    validator
        .body('encryptionKeys.pubKey.key')
        .exists()
        .withMessage('No valid encrypted public key found.'),
    validator
        .body('encryptionKeys.encPriKey')
        .exists()
        .withMessage('No valid encrypted private key param found.'),
    validator
        .body('encryptionKeys.encPriKey.enc')
        .exists()
        .withMessage('No valid encrypted private key found.'),
    validator
        .body('encryptionKeys.encPriKey.key')
        .exists()
        .withMessage('No valid encrypted private key found.'),
    validator
        .body('encryptionKeys.encSymKey')
        .exists()
        .withMessage('No valid encrypted symmetric key param found.'),
    validator
        .body('encryptionKeys.encSymKey.kid')
        .exists()
        .withMessage('No valid encrypted symmetric key found.'),
    validator
        .body('encryptionKeys.encSymKey.enc')
        .exists()
        .withMessage('No valid encrypted symmetric key found.'),
    validator
        .body('encryptionKeys.encSymKey.tagLength')
        .exists()
        .withMessage('No valid encrypted symmetric key found.'),
    validator
        .body('encryptionKeys.encSymKey.tag')
        .exists()
        .withMessage('No valid encrypted symmetric key found.'),
    validator
        .body('encryptionKeys.encSymKey.key')
        .exists()
        .withMessage('No valid encrypted symmetric key found.'),
    validator
        .body('encryptionKeys.encSymKey.iv')
        .exists()
        .withMessage('No valid encrypted symmetric key found.'),
    validator
        .body('encryptionKeys.encSymKey.iterations')
        .exists()
        .withMessage('No valid encrypted symmetric key found.'),
    validator
        .body('encryptionKeys.encSymKey.salt')
        .exists()
        .withMessage('No valid encrypted symmetric key found.'),
    validator
        .body('encryptionKeys.encVaultKey')
        .exists()
        .withMessage('No valid encrypted vault key param found.'),
    validator
        .body('encryptionKeys.encVaultKey.alg')
        .exists()
        .withMessage('No valid encrypted vault key found.'),
    validator
        .body('encryptionKeys.encVaultKey.kty')
        .exists()
        .withMessage('No valid encrypted vault key found.'),
    validator
        .body('encryptionKeys.encVaultKey.key')
        .exists()
        .withMessage('No valid encrypted vault key found.'),
];

exports.finalizeAccountValidationBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const emailError = errorsObj.email && errorsObj.email.msg;
        const userIdError = errorsObj.userId && errorsObj.userId.msg;
        const saltError = errorsObj.salt && errorsObj.salt.msg;
        const verifierError = errorsObj.verifier && errorsObj.verifier.msg;
        const encryptionKeysError = errorsObj.encryptionKeys && errorsObj.encryptionKeys.msg;

        // EncPubKey
        const pubKeyError = errorsObj['encryptionKeys.pubKey'] && errorsObj['encryptionKeys.pubKey'].msg;
        const pubKeyBodyKeyError = errorsObj['encryptionKeys.pubKey.key'] && errorsObj['encryptionKeys.pubKey.key'].msg;

        // EncPriKey
        const priKeyError = errorsObj['encryptionKeys.encPriKey'] && errorsObj['encryptionKeys.encPriKey'].msg;
        const priKeyBodyEncError =
            errorsObj['encryptionKeys.encPriKey.enc'] && errorsObj['encryptionKeys.encPriKey.enc'].msg;
        const priKeyBodyKeyError =
            errorsObj['encryptionKeys.encPriKey.key'] && errorsObj['encryptionKeys.encPriKey.key'].msg;

        // EncSymKey
        const symKeyError = errorsObj['encryptionKeys.encSymKey'] && errorsObj['encryptionKeys.encSymKey'].msg;
        const symKeyBodyKidError =
            errorsObj['encryptionKeys.encSymKey.kid'] && errorsObj['encryptionKeys.encSymKey.kid'].msg;
        const symKeyBodyEncError =
            errorsObj['encryptionKeys.encSymKey.enc'] && errorsObj['encryptionKeys.encSymKey.enc'].msg;
        const symKeyBodyTagLengthError =
            errorsObj['encryptionKeys.encSymKey.tagLength'] && errorsObj['encryptionKeys.encSymKey.tagLength'].msg;
        const symKeyBodyTagError =
            errorsObj['encryptionKeys.encSymKey.tag'] && errorsObj['encryptionKeys.encSymKey.tag'].msg;
        const symKeyBodyKeyError =
            errorsObj['encryptionKeys.encSymKey.key'] && errorsObj['encryptionKeys.encSymKey.key'].msg;
        const symKeyBodyIVError =
            errorsObj['encryptionKeys.encSymKey.iv'] && errorsObj['encryptionKeys.encSymKey.iv'].msg;
        const symKeyBodyIterationsError =
            errorsObj['encryptionKeys.encSymKey.iterations'] && errorsObj['encryptionKeys.encSymKey.iterations'].msg;
        const symKeyBodySaltError =
            errorsObj['encryptionKeys.encSymKey.salt'] && errorsObj['encryptionKeys.encSymKey.salt'].msg;

        // EncVaultKey
        const vaultKeyError = errorsObj['encryptionKeys.encVaultKey'] && errorsObj['encryptionKeys.encVaultKey'].msg;
        const vaultKeyBodyAlgError =
            errorsObj['encryptionKeys.encVaultKey.alg'] && errorsObj['encryptionKeys.encVaultKey.alg'].msg;
        const vaultKeyBodyKtyError =
            errorsObj['encryptionKeys.encVaultKey.kty'] && errorsObj['encryptionKeys.encVaultKey.kty'].msg;
        const vaultKeyBodyKeyError =
            errorsObj['encryptionKeys.encVaultKey.key'] && errorsObj['encryptionKeys.encVaultKey.key'].msg;

        return res.status(400).json({
            error: {
                msg:
                    emailError ||
                    userIdError ||
                    saltError ||
                    verifierError ||
                    encryptionKeysError ||
                    pubKeyError ||
                    pubKeyBodyKeyError ||
                    priKeyError ||
                    priKeyBodyEncError ||
                    priKeyBodyKeyError ||
                    symKeyError ||
                    symKeyBodyKidError ||
                    symKeyBodyEncError ||
                    symKeyBodyTagLengthError ||
                    symKeyBodyTagError ||
                    symKeyBodyKeyError ||
                    symKeyBodyIVError ||
                    symKeyBodyIterationsError ||
                    symKeyBodySaltError ||
                    vaultKeyError ||
                    vaultKeyBodyAlgError ||
                    vaultKeyBodyKtyError ||
                    vaultKeyBodyKeyError,
                reportedAt: new Date().getTime(),
            },
        });
    }
    return next();
};

/* Login Form */
exports.loginValidationCriterias = [
    validator
        .body('email')
        .exists()
        .withMessage('You must provide a valid email address.')
        .isLength({ max: 254 })
        .withMessage('Email must be 254 characters or less.')
        .isEmail()
        .withMessage('Email address you entered is not valid.')
        .trim()
        .normalizeEmail(),
    validator
        .body('stage')
        .exists()
        .withMessage('No srp stage is specified.')
        .isLength({ min: 4, max: 5 })
        .withMessage('Stage must be 5 characters or less.'),
];

exports.loginValidationBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const emailError = errorsObj.email && errorsObj.email.msg;
        const stageError = errorsObj.stage && errorsObj.stage.msg;
        return res.status(400).json({
            error: {
                msg: emailError || stageError,
                reportedAt: new Date().getTime(),
            },
        });
    }
    return next();
};

/* Login Form */
exports.addOrUpdateItemCriterias = [
    validator
        .body('encDetails')
        .exists()
        .withMessage('Missing Encrypted Details.'),
    validator
        .body('encDetails.tag')
        .exists()
        .withMessage('Missing Encrypted Details Tag.'),
    validator
        .body('encDetails.data')
        .exists()
        .withMessage('Missing Encrypted Details Data Field.'),
    validator
        .body('encDetails.tagLength')
        .exists()
        .withMessage('Missing Encrypted Details Tag-Length Field.'),
    validator
        .body('encDetails.iv')
        .exists()
        .withMessage('Missing Encrypted Details IV Field.'),
    validator
        .body('encOverview')
        .exists()
        .withMessage('Missing Encrypted Overview.'),
    validator
        .body('encOverview.tag')
        .exists()
        .withMessage('Missing Encrypted Overview Tag.'),
    validator
        .body('encOverview.data')
        .exists()
        .withMessage('Missing Encrypted Overview Data Field.'),
    validator
        .body('encOverview.tagLength')
        .exists()
        .withMessage('Missing Encrypted Overview Tag-Length Field.'),
    validator
        .body('encOverview.iv')
        .exists()
        .withMessage('Missing Encrypted Overview IV Field.'),
    validator
        .body('itemId')
        .exists()
        .withMessage('Missing item id.'),
    validator
        .body('modifiedAt')
        .exists()
        .withMessage('Missing last modified time.'),
];

exports.addOrUpdateItemBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();

        // EncDetails
        const encDetailsError = errorsObj.encDetails && errorsObj.encDetails.msg;
        const encDetailsTagError = errorsObj['encDetails.tag'] && errorsObj['encDetails.tag'].msg;
        const encDetailsDataError = errorsObj['encDetails.data'] && errorsObj['encDetails.data'].msg;
        const encDetailsTagLengthError = errorsObj['encDetails.tagLength'] && errorsObj['encDetails.tagLength'].msg;
        const encDetailsIVError = errorsObj['encDetails.iv'] && errorsObj['encDetails.iv'].msg;

        // EncOverview
        const encOverviewError = errorsObj.encOverview && errorsObj.encOverview.msg;
        const encOverviewTagError = errorsObj['encOverview.tag'] && errorsObj['encOverview.tag'].msg;
        const encOverviewDataError = errorsObj['encOverview.data'] && errorsObj['encOverview.data'].msg;
        const encOverviewTagLengthError = errorsObj['encOverview.tagLength'] && errorsObj['encOverview.tagLength'].msg;
        const encOverviewIVError = errorsObj['encOverview.iv'] && errorsObj['encOverview.iv'].msg;

        const itemIdError = errorsObj.itemId && errorsObj.itemId.msg;
        const modifiedAtError = errorsObj.modifiedAt && errorsObj.modifiedAt.msg;
        return res.status(400).json({
            error: {
                msg:
                    encDetailsError ||
                    encDetailsTagError ||
                    encDetailsDataError ||
                    encDetailsTagLengthError ||
                    encDetailsIVError ||
                    encOverviewError ||
                    encOverviewTagError ||
                    encOverviewDataError ||
                    encOverviewTagLengthError ||
                    encOverviewIVError ||
                    itemIdError ||
                    modifiedAtError,
                reportedAt: new Date().getTime(),
            },
        });
    }
    return next();
};

/* Delete item */
exports.deleteItemCriterias = [
    validator
        .body('itemId')
        .exists()
        .withMessage('Missing item id.')
        .isLength({ min: 13 })
        .withMessage('Item id must be 13 characters or more.'),
];

exports.deleteItemBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const itemIdError = errorsObj.itemId && errorsObj.itemId.msg;
        return res.status(400).json({
            error: {
                msg: itemIdError,
                reportedAt: new Date().getTime(),
            },
        });
    }
    return next();
};

/* Create or Update Folder */
exports.createOrUpdateFolderCriterias = [
    validator
        .body('folderId')
        .exists()
        .withMessage('Missing folder id.'),
    validator
        .body('folderName')
        .exists()
        .withMessage('Missing folder name.'),
];

exports.createOrUpdateFolderBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const folderIdError = errorsObj.folderId && errorsObj.folderId.msg;
        const folderNameError = errorsObj.folderName && errorsObj.folderName.msg;
        return res.status(400).json({
            error: {
                msg: folderIdError || folderNameError,
                reportedAt: new Date().getTime(),
            },
        });
    }
    return next();
};

/* ------------------------------------------------------------- */
/*                 // ToDo: REFACTOR Later
/* ------------------------------------------------------------- */

/* Forget Password Form */
exports.resetPasswordFormCriterias = [
    validator
        .body('email')
        .exists()
        .withMessage('You must provide a valid email address.')
        .isEmail()
        .withMessage('Email address you entered is not valid.')
        .trim()
        .normalizeEmail(),
];

exports.resetPasswordFormBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const emailError = errorsObj.email && errorsObj.email.msg;
        return res.status(400).json({
            error: {
                msg: emailError,
                reportedAt: new Date().getTime(),
            },
        });
    }
    return next();
};

/* Email - Password Reset Link */
exports.emailPasswordResetCriterias = [
    validator
        .query('email')
        .exists()
        .withMessage("Link doesn't contain an email address.")
        .isEmail()
        .withMessage("Link doesn't contain a valid email address.")
        .trim()
        .normalizeEmail(),
    validator
        .query('passwordResetToken')
        .exists()
        .withMessage("Link doesn't contain a valid password reset token."),
];

exports.emailPasswordResetBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const emailError = errorsObj.email && errorsObj.email.msg;
        const tokenError = errorsObj.passwordResetToken && errorsObj.passwordResetToken.msg;
        return res.status(400).json({
            error: {
                msg: emailError || tokenError,
                reportedAt: new Date().getTime(),
            },
        });
    }
    return next();
};

exports.changePasswordCriterias = [
    validator
        .body('password', 'New Master Password should be at least 8 chars long.')
        .exists()
        .withMessage('You must supply a new OnePass Master Password.')
        .isLength({ min: 8 }),
];

exports.changePasswordBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const passwordError = errorsObj.password && errorsObj.password.msg;
        return res.status(400).json({
            error: {
                msg: passwordError,
                reportedAt: new Date().getTime(),
            },
        });
    }
    return next();
};
