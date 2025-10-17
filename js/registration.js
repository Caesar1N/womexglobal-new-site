document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const nav = document.querySelector('header nav');

    if (menuToggleBtn && nav) {
        menuToggleBtn.addEventListener('click', () => {
            nav.classList.toggle('menu-open');
        });
    }

    // --- Registration Form Logic ---
    const chooserButtons = document.querySelectorAll('.chooser-btn');
    const registrationForms = document.querySelectorAll('.registration-form');
    const generalError = document.getElementById('general-error');

    if (!chooserButtons.length || !registrationForms.length) {
        console.error('Registration form elements not found!');
        return; // Stop if essential elements are missing
    }

    // Logic for switching between forms
    chooserButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetFormId = button.getAttribute('data-form');
            
            chooserButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            registrationForms.forEach(form => {
                form.classList.toggle('active', form.id === targetFormId);
            });
        });
    });

    // Logic for handling form submission
    registrationForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            generalError.textContent = '';
            generalError.style.display = 'none';

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            // --- Basic Frontend Validation ---
            if (data.password !== data.confirmPassword) {
                generalError.textContent = 'Passwords do not match.';
                generalError.style.display = 'block';
                return;
            }

            // --- Prepare Data for API ---
            const registrationType = e.target.id.split('-')[0].charAt(0).toUpperCase() + e.target.id.split('-')[0].slice(1);
            
            // Handle different name fields (firstName/lastName vs fullName)
            let firstName, lastName;
            if (data.fullName) {
                const nameParts = data.fullName.split(' ');
                firstName = nameParts[0];
                lastName = nameParts.slice(1).join(' ') || firstName; // Handle single-word names
            } else {
                firstName = data.firstName;
                lastName = data.lastName;
            }
            
            const apiPayload = {
                firstName: firstName,
                lastName: lastName,
                email: data.email,
                password: data.password,
                registrationType: registrationType,
                formData: data, // The backend can filter this later if needed
            };

            // Remove user-specific fields from formData before sending
            delete apiPayload.formData.firstName;
            delete apiPayload.formData.lastName;
            delete apiPayload.formData.fullName;
            delete apiPayload.formData.email;
            delete apiPayload.formData.password;
            delete apiPayload.formData.confirmPassword;

            console.log('Sending to API:', apiPayload); // For debugging

            // --- Send Data to Backend ---
            try {
                const response = await fetch(' https://womex-global-api-423358063719.us-central1.run.app/api/auth/register-and-submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(apiPayload),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Registration failed.');
                }

                // --- Handle Success ---
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('registrationId', result.registrationId);
                
                window.location.href = '/dashboard.html';

            } catch (error) {
                generalError.textContent = error.message;
                generalError.style.display = 'block';
            }
        });
    });
});