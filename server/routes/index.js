const express = require('express');
const router = express.Router();
const path = require('path');
const { catchErrors } = require('../handlers/errorHandlers');
const appController = require('../controllers/appController');
const api = require('./api');



router.get('/', appController.getIndex);

router.get('/api/v1/', api.sendStatus);


module.exports = router;
