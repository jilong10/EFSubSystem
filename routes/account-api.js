const express = require('express');
const router = express.Router();
const accountHelper = require('../helpers/account-helper');

router.post('/register', accountHelper.register);
router.post('/login', accountHelper.login);

module.exports = router;