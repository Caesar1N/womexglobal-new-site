const express = require('express');
const router = express.Router();
const { submitContactForm, submitRegistrationForm } = require('../controllers/formController');
const { protect } = require('../middleware/authMiddleware');

// Route for submitting the contact form
router.post('/contact', submitContactForm);

// Route for submitting a registration form (Protected)
router.post('/register', protect, submitRegistrationForm); // 2. ADD the new route with middleware

module.exports = router;