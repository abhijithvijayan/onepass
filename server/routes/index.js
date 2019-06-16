const express = require('express');
const router = express.Router();
const path = require('path');
const { catchErrors } = require('../handlers/errorHandlers');
const authController = require('../controllers/authController');
const api = require('./api');

router.get('/api/v1/', api.sendStatus);

/* User and authentication routes */

router.post('/api/v1/auth/signup', api.sendStatus);
router.post('/api/v1/auth/login', api.sendStatus);


module.exports = router;
