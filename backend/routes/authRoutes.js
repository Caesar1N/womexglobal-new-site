const express = require('express');
const router = express.Router();
const { registerUser, loginUser, registerAndSubmit } = require('../controllers/authController');

// Define the routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/register-and-submit', registerAndSubmit);

module.exports = router;