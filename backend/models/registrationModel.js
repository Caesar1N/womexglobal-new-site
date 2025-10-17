const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
    {
        // This links the registration to a user account in our 'users' collection.
        // It's a reference to a document in the User model.
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        // This tells us which type of registration it is.
        registrationType: {
            type: String,
            required: true,
            enum: ['Visitor', 'Delegate', 'Sponsor', 'Exhibitor'],
        },
        // This flexible field will store the unique data from each specific form.
        // `mongoose.Schema.Types.Mixed` means it can be any object structure.
        formData: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        // We will update this field later during the payment phase.
        paymentStatus: {
            type: String,
            required: true,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        // We will add an invoice reference here later.
        invoiceId: {
            type: String,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

module.exports = mongoose.model('Registration', registrationSchema);