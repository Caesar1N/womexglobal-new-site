const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Registration = require('../models/registrationModel');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Check if all fields are provided
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user in the database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        if (user) {
            // User created successfully, now generate a token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.status(201).json({
                _id: user.id,
                firstName: user.firstName,
                email: user.email,
                token: token,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate a user (login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });

        // If user exists and password matches
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.json({
                _id: user.id,
                firstName: user.firstName,
                email: user.email,
                token: token,
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const registerAndSubmit = async (req, res) => {
    // Separate user data from the rest of the registration data
    const { firstName, lastName, email, password, registrationType, formData } = req.body;

    try {
        // --- Part 1: User Creation (similar to your existing registerUser) ---

        // Basic validation for user fields
        if (!firstName || !lastName || !email || !password || !registrationType || !formData) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'A user with this email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid user data, could not create user' });
        }

        // --- Part 2: Registration Submission ---

        const registration = await Registration.create({
            user: user._id, // Link to the newly created user
            registrationType,
            formData,
        });

        if (!registration) {
            // Optional: You might want to delete the user that was just created if the registration fails
            await User.findByIdAndDelete(user._id);
            return res.status(400).json({ message: 'Invalid registration data, could not create registration' });
        }

        // --- Part 3: Respond with Success (similar to login) ---

        // Generate a JWT token so the user is instantly logged in
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        // Send back all the necessary info to the frontend
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            email: user.email,
            token: token,
            registrationId: registration._id, // Send the new registration ID
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    registerUser,
    loginUser,
    registerAndSubmit,
};