const express = require('express');
const router = express.Router();
const accountHelper = require('../helpers').AccountHelper;

router.post('/register', accountHelper.register);
router.post('/login', accountHelper.login);

module.exports = router;