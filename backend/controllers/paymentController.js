const axios = require('axios');
const Registration = require('../models/registrationModel');

// Prices for Delegate types (in kobo)
const delegatePrices = {
    'Delegate': 50000,
    'VIP Delegate': 100000,
    'Student Delegate': 25000,
};

// Prices for Exhibitor booth sizes (in kobo)
const exhibitorPrices = {
    '2m x 2m': 150000, // Example: 1500 NGN
    '2m x 3m': 200000, // Example: 2000 NGN
    '3m x 3m': 250000, // Example: 2500 NGN
    '3m x 4m': 300000,
    '3m x 6m': 400000,
    '4m x 6m': 500000,
    '5m x 6m': 600000,
    '6m x 6m': 750000,
};

// @desc    Initialize a payment transaction
// @route   POST /api/payments/initialize
// @access  Private
const initializePayment = async (req, res) => {
    const { registrationId } = req.body;
    const user = req.user;

    try {
        const registration = await Registration.findById(registrationId);

        if (!registration || registration.user.toString() !== user._id.toString()) {
            return res.status(404).json({ message: 'Registration not found or not authorized' });
        }

        let amount = 0; // Default amount is 0

        // --- NEW PRICING LOGIC ---
        if (registration.registrationType === 'Delegate') {
            // NOTE: This assumes that for delegates, a 'delegateType' field is saved in formData.
            // Let's adjust this to be more robust if it's not there.
            const delegateType = registration.formData.delegateType || 'Delegate'; // Default to 'Delegate'
            amount = delegatePrices[delegateType];
        } else if (registration.registrationType === 'Exhibitor') {
            const spaceRequired = registration.formData.space; // Get the selected space from the form data
            amount = exhibitorPrices[spaceRequired];
        } else if (registration.registrationType === 'Sponsor') {
            // For now, let's set a default sponsor price. You can make this more complex later.
            amount = 1000000; // Example: 10,000 NGN
        }
        // For 'Visitor', the amount remains 0, so it's a free registration.

        // If amount is not found or is zero for a paid category, return an error.
        if (!amount && registration.registrationType !== 'Visitor') {
             return res.status(400).json({ message: 'Invalid registration type for pricing.' });
        }

        // If the registration is free (like for a Visitor), we can just update the status and finish.
        if (amount === 0) {
             await Registration.findByIdAndUpdate(registrationId, { paymentStatus: 'completed' });
             return res.status(200).json({ status: 'success', message: 'Registration is free and has been completed.' });
        }
        
        // --- END OF NEW PRICING LOGIC ---


        const paystackData = {
            email: user.email,
            amount: amount,
            metadata: {
                registration_id: registration._id.toString(),
            },
            callback_url: `${process.env.BACKEND_URL}/api/payments/verify`,
        };

        const paystackResponse = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            paystackData,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        res.json(paystackResponse.data);

    } catch (error) {
        console.error('Paystack initialization error:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Server error during payment initialization.' });
    }
};

// ... (The rest of the file, including verifyPayment, remains the same) ...
const verifyPayment = async (req, res) => {
    const { reference } = req.query;

    try {
        const paystackResponse = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const { status, metadata } = paystackResponse.data.data;

        if (status === 'success') {
            const registrationId = metadata.registration_id;
            await Registration.findByIdAndUpdate(registrationId, {
                paymentStatus: 'completed',
            });
            return res.redirect(`${process.env.FRONTEND_URL}/payment-success.html`);
        } else {
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure.html`);
        }

    } catch (error) {
        console.error('Paystack verification error:', error.response ? error.response.data : error.message);
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failure.html`);
    }
};

module.exports = {
    initializePayment,
    verifyPayment,
};