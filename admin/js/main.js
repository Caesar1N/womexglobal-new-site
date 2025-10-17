document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');

    // If no token is found, redirect to login page immediately
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const API_BASE_URL = ' https://womex-global-api-423358063719.us-central1.run.app/api/admin';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    // Function to fetch data from a given endpoint
    const fetchData = async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, { headers });
            if (!response.ok) {
                // If token is invalid, redirect to login
                if (response.status === 401) {
                    localStorage.clear();
                    window.location.href = 'login.html';
                }
                throw new Error('Could not fetch data');
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
        }
    };

    // Function to populate the registrations table
    const populateRegistrations = async () => {
        const registrations = await fetchData('registrations');
        const tableBody = document.querySelector('#registrations-table tbody');
        if (!registrations || !tableBody) return;
        
        tableBody.innerHTML = ''; // Clear existing rows
        registrations.forEach(reg => {
            const row = `
                <tr>
                    <td>${reg.registrationType}</td>
                    <td>${reg.user ? `${reg.user.firstName} ${reg.user.lastName}` : 'N/A'}</td>
                    <td>${reg.user ? reg.user.email : 'N/A'}</td>
                    <td>${reg.paymentStatus}</td>
                    <td>${new Date(reg.createdAt).toLocaleDateString()}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // Function to populate the users table
    const populateUsers = async () => {
        const users = await fetchData('users');
        const tableBody = document.querySelector('#users-table tbody');
        if (!users || !tableBody) return;

        tableBody.innerHTML = '';
        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // Function to populate the contacts table
    const populateContacts = async () => {
        const contacts = await fetchData('contacts');
        const tableBody = document.querySelector('#contacts-table tbody');
        if (!contacts || !tableBody) return;

        tableBody.innerHTML = '';
        contacts.forEach(contact => {
            const row = `
                <tr>
                    <td>${contact.name}</td>
                    <td>${contact.email}</td>
                    <td>${contact.inquiryType || 'N/A'}</td>
                    <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    };

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.clear(); // Clear token and user info
        window.location.href = 'login.html';
    });


    // Initial data fetch
    populateRegistrations();
    populateUsers();
    populateContacts();
});