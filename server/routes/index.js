const path = require('path');
const express = require('express');
const router = express.Router();

const { catchErrors } = require('../handlers/errorHandlers');
const user = require('../controllers/userController');
const auth = require('../controllers/authController');
const { 
    validationCriterias,
    validateBody
} = require('../controllers/validateBodyController');
const api = require('./api');

router.get('/api/v1/', api.sendStatus);

/* User and authentication routes */
router.post('/api/v1/auth/signup', validationCriterias, validateBody, api.sendStatus);
// router.post('/api/v1/auth/login', validationCriterias, validateBody, auth.login);



module.exports = router;
