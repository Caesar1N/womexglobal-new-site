const Registration = require('../models/registrationModel');

// @desc    Get the current user's registrations
// @route   GET /api/users/me/registrations
// @access  Private
const getMyRegistrations = async (req, res) => {
    try {
        // Find registrations that belong to the logged-in user (req.user.id comes from the 'protect' middleware)
        const registrations = await Registration.find({ user: req.user.id });

        if (!registrations) {
            return res.status(404).json({ message: 'No registrations found for this user.' });
        }

        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMyRegistrations,
};