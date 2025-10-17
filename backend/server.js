const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config(); // This loads the variables from .env

connectDB(); // Call the function to connect to the database
// Initialize the Express app
const app = express();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON data in the body of requests

// 2. Serve static files from the main project directory
// path.join(__dirname, '..') goes up one level from /backend to your project root
app.use(express.static(path.join(__dirname, '..')));

// Serve the admin panel files
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// A simple test route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the Womex Global API!' });
});

// Use the auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Use the form routes
app.use('/api/forms', require('./routes/formRoutes'));

// Use the payment routes
app.use('/api/payments', require('./routes/paymentRoutes'));

// Use the admin routes
app.use('/api/admin', require('./routes/adminRoutes'));

app.use('/api/users', require('./routes/userRoutes'));

// --- Frontend Catch-all Route ---
// This route uses a regular expression to match any GET request
// that does NOT start with '/api'. This is the key fix.
app.get(/^(?!\/api).*/, (req, res) => {
    // Determine which HTML file to send. If the path starts with /admin, send the admin index.
    // Otherwise, send the main site index.
    if (req.originalUrl.startsWith('/admin')) {
         res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
    } else {
         res.sendFile(path.join(__dirname, '..', 'index.html'));
    }
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});