const ContactForm = require('../models/contactFormModel');
const Registration = require('../models/registrationModel');

// @desc    Submit a contact form
// @route   POST /api/forms/contact
// @access  Public
const submitContactForm = async (req, res) => {
    // The data from the form will be in req.body
    const { name, email, phone, address, inquiryType, purpose, date } = req.body;

    try {
        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and Email are required fields.' });
        }

        // Create a new contact form entry in the database
        const submission = await ContactForm.create({
            name,
            email,
            phone,
            address,
            inquiryType,
            purpose,
            date,
        });

        if (submission) {
            res.status(201).json({ message: 'Form submitted successfully!', data: submission });
        } else {
            res.status(400).json({ message: 'Invalid form data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Submit a registration form
// @route   POST /api/forms/register
// @access  Private
const submitRegistrationForm = async (req, res) => {
    const { registrationType, formData } = req.body;

    try {
        // Validation
        if (!registrationType || !formData) {
            return res.status(400).json({ message: 'Registration type and form data are required.' });
        }

        // Create the registration in the database
        const registration = await Registration.create({
            user: req.user.id, // Get the user ID from the 'protect' middleware
            registrationType,
            formData,
        });

        if (registration) {
            res.status(201).json({ message: 'Registration submitted successfully!', data: registration });
        } else {
            res.status(400).json({ message: 'Invalid registration data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    submitContactForm,
    submitRegistrationForm, // Make sure this line is present
};