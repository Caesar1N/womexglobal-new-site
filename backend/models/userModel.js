const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please add a first name'],
        },
        lastName: {
            type: String,
            required: [true, 'Please add a last name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true, // Each email must be unique
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ['user', 'admin'], // Role can only be 'user' or 'admin'
            default: 'user',
        },
        // We can add more fields here later if needed
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('User', userSchema);