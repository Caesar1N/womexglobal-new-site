const express = require('express');
const router = express.Router();
const { getUsers, getRegistrations, getContactSubmissions } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes in this file will first be protected, then checked for admin status
router.get('/users', protect, admin, getUsers);
router.get('/registrations', protect, admin, getRegistrations);
router.get('/contacts', protect, admin, getContactSubmissions);

module.exports = router;