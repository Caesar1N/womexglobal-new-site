document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    const dashboardContainer = document.getElementById('dashboard-container');

    // --- 1. Authentication Check ---
    if (!token) {
        window.location.href = '/login.html'; // Redirect to login if not authenticated
        return;
    }

    // --- 2. Logout Button ---
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = '/login.html';
        });
    }

    // --- 3. Fetch Registration Data ---
    try {
        const response = await fetch(' https://womex-global-api-423358063719.us-central1.run.app/api/users/me/registrations', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // If token is expired/invalid, clear storage and redirect to login
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = '/login.html';
            }
            throw new Error('Failed to fetch registration details.');
        }

        const registrations = await response.json();

        // For this project, we assume one registration per user.
        const registration = registrations[0]; 

        if (!registration) {
            dashboardContainer.innerHTML = `<p>You have not completed a registration yet. Please <a href="/registrations.html">register here</a>.</p>`;
            return;
        }

        // --- 4. Display Registration Data ---
        let detailsHtml = '';
        for (const [key, value] of Object.entries(registration.formData)) {
            // Capitalize the key for display
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
            detailsHtml += `<dt>${formattedKey}</dt><dd>${value}</dd>`;
        }

        dashboardContainer.innerHTML = `
            <div class="dashboard-header">
                <h2>Your Registration Details</h2>
                <p>Type: <strong>${registration.registrationType}</strong></p>
            </div>
            <dl class="registration-details">
                ${detailsHtml}
            </dl>
            <div class="payment-section">
                <h3>Payment Status</h3>
                <p class="status-${registration.paymentStatus}">
                    ${registration.paymentStatus.toUpperCase()}
                </p>
                ${registration.paymentStatus === 'pending' ? 
                    `<button id="pay-now-btn" class="btn btn-primary btn-large">Proceed to Payment</button>
                     <p id="payment-error" class="error-message" style="display:none;"></p>`
                    : 
                    '<p>Thank you for your payment. You can download your invoice below.</p>'
                }
            </div>
        `;

        // --- 5. Payment Button Logic ---
        const payNowBtn = document.getElementById('pay-now-btn');
        if (payNowBtn) {
            payNowBtn.addEventListener('click', async () => {
                const paymentError = document.getElementById('payment-error');
                paymentError.textContent = '';
                payNowBtn.textContent = 'Initializing...';
                payNowBtn.disabled = true;

                try {
                    const initResponse = await fetch(' https://womex-global-api-423358063719.us-central1.run.app/api/payments/initialize', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ registrationId: registration._id })
                    });
                    
                    const initData = await initResponse.json();

                    if (!initResponse.ok) {
                        throw new Error(initData.message || 'Could not start payment.');
                    }

                    // Redirect user to Paystack's payment page
                    window.location.href = initData.data.authorization_url;

                } catch (error) {
                    paymentError.textContent = error.message;
                    paymentError.style.display = 'block';
                    payNowBtn.textContent = 'Proceed to Payment';
                    payNowBtn.disabled = false;
                }
            });
        }

    } catch (error) {
        dashboardContainer.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
    }

    // Mobile menu toggle for the dashboard header
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const nav = document.querySelector('header nav');
    if (menuToggleBtn && nav) {
        menuToggleBtn.addEventListener('click', () => {
            nav.classList.toggle('menu-open');
        });
    }
});