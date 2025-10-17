const express = require('express');
const router = express.Router();
const { initializePayment, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/payments/initialize
// @desc    Initialize a payment
// @access  Private
router.post('/initialize', protect, initializePayment);

// @route   GET /api/payments/verify
// @desc    Verify a payment
// @access  Public
router.get('/verify', verifyPayment);

module.exports = router;