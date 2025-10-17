const express = require('express');
const router = express.Router();
const { getMyRegistrations } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected. A user must be logged in to access it.
router.get('/me/registrations', protect, getMyRegistrations);

module.exports = router;