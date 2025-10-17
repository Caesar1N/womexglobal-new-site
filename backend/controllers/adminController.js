const User = require('../models/userModel');
const Registration = require('../models/registrationModel');
const ContactForm = require('../models/contactFormModel');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Get all registrations
// @route   GET /api/admin/registrations
// @access  Private/Admin
const getRegistrations = async (req, res) => {
    const registrations = await Registration.find({}).populate('user', 'firstName lastName email');
    res.json(registrations);
};

// @desc    Get all contact form submissions
// @route   GET /api/admin/contacts
// @access  Private/Admin
const getContactSubmissions = async (req, res) => {
    const contacts = await ContactForm.find({});
    res.json(contacts);
};

module.exports = {
    getUsers,
    getRegistrations,
    getContactSubmissions,
};