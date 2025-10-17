const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        inquiryType: {
            type: String,
        },
        purpose: {
            type: String,
        },
        date: {
            type: Date,
        },
        // We will handle the file upload in a later phase as it's more complex.
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('ContactForm', contactFormSchema);