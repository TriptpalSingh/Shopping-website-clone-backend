const express = require('express');

const router = express.Router();

const signupHandler = require('../controllers/signupHandler');
const handleLogin = require('../controllers/handleLogin');

router.post('/signup', signupHandler);
router.post('/login', handleLogin);



module.exports = router;