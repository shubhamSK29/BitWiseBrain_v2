// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set initial focus to the first input field with a slight delay
    setTimeout(() => {
        const firstInput = document.querySelector('.form input:first-of-type');
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);

    // Handle form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('.btnn');
            
            if (validateForm(this)) {
                try {
                    submitBtn.disabled = true;
                    submitBtn.style.background = '#19b8e6';
                    submitBtn.textContent = 'Processing...';
                    
                    // Use current domain for API calls
                    const apiUrl = `${window.location.origin}/api/auth`;
                    console.log('Sending login request to:', apiUrl);

                    const formData = {
                        action: 'login',
                        email: this.querySelector('input[name="email"]').value,
                        password: this.querySelector('input[name="password"]').value
                    };

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    const data = await response.json();

                    if (response.ok) {
                        localStorage.setItem('user', formData.email);
                        showSuccess(this);
                        
                        setTimeout(() => {
                            window.location.href = './assets/html/main.html';
                        }, 1500);
                    } else {
                        throw new Error(data.error || 'Login failed');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    showError(this, error.message);
                    submitBtn.disabled = false;
                    submitBtn.style.background = '#1ec8ff';
                    submitBtn.textContent = 'Log In';
                }
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('.btnn');
            
            if (validateForm(this)) {
                try {
                    // Show loading state
                    submitBtn.disabled = true;
                    submitBtn.style.background = '#19b8e6';
                    submitBtn.textContent = 'Processing...';
                    
                    // Log the request details
                    console.log('Sending signup request...');
                    
                    const formData = {
                        action: 'register',
                        email: this.querySelector('input[name="email"]').value,
                        password: this.querySelector('input[name="password"]').value
                    };

                    // Use the current domain for the API endpoint
                    const apiUrl = `${window.location.origin}/api/auth`;
                    console.log('API URL:', apiUrl);

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    // Log the raw response
                    const rawResponse = await response.text();
                    console.log('Raw response:', rawResponse);

                    // Try to parse the response as JSON
                    let data;
                    try {
                        data = JSON.parse(rawResponse);
                    } catch (parseError) {
                        console.error('Failed to parse response as JSON:', parseError);
                        throw new Error('Server returned invalid JSON');
                    }

                    if (response.ok) {
                        // Store user session
                        localStorage.setItem('user', formData.email);
                        showSuccess(this);
                        
                        setTimeout(() => {
                            window.location.href = './assets/html/main.html';
                        }, 1500);
                    } else {
                        throw new Error(data.error || 'Registration failed');
                    }
                } catch (error) {
                    console.error('Signup error:', error);
                    showError(this, error.message);
                    submitBtn.disabled = false;
                    submitBtn.style.background = '#1ec8ff';
                    submitBtn.textContent = 'Sign Up';
                }
            }
        });
    }

    // Prevent tab from focusing on menu items first
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
            e.preventDefault();
            const firstInput = document.querySelector('.form input:first-of-type');
            if (firstInput) {
                firstInput.focus();
            }
        }
    });

    // Form handling
    const form = document.querySelector('.form');
    if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            // Validate on input with debounce
            let debounceTimer;
            input.addEventListener('input', function() {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    validateInput(input);
                }, 500);
            });

            // Validate on blur
            input.addEventListener('blur', function() {
                validateInput(input);
            });

            // Clear error on focus
            input.addEventListener('focus', function() {
                removeError(input);
            });
        });
    }

    const navbar = document.querySelector('.left-navbar');
    const hamburger = document.querySelector('.hamburger');
    
    // Toggle navbar expansion
    hamburger.addEventListener('click', function() {
        navbar.classList.toggle('expanded');
        
        // Change hamburger icon
        const icon = this.querySelector('ion-icon');
        if (navbar.classList.contains('expanded')) {
            icon.setAttribute('name', 'close-outline');
        } else {
            icon.setAttribute('name', 'menu-outline');
        }
    });
    
    // Close navbar when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navbar.classList.contains('expanded')) {
            navbar.classList.remove('expanded');
            hamburger.querySelector('ion-icon').setAttribute('name', 'menu-outline');
        }
    });
});

function validateForm(form) {
    const isSignup = form.classList.contains('signup-form');
    const inputs = form.querySelectorAll('input');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    // Additional validation for signup
    if (isSignup) {
        const password = form.querySelector('input[name="password"]');
        const confirmPassword = form.querySelector('input[name="confirm-password"]');
        
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }
    }

    return isValid;
}

function validateInput(input) {
    const value = input.value.trim();
    
    // Check if empty
    if (!value) {
        showError(input, 'This field is required');
        return false;
    }

    // Email validation
    if (input.type === 'email') {
        if (!isValidEmail(value)) {
            showError(input, 'Please enter a valid email');
            return false;
        }
    }

    // Password validation
    if (input.type === 'password' && input.name === 'password') {
        if (value.length < 8) {
            showError(input, 'Password must be at least 8 characters');
            return false;
        }
        if (!/\d/.test(value)) {
            showError(input, 'Password must contain at least one number');
            return false;
        }
        if (!/[A-Z]/.test(value)) {
            showError(input, 'Password must contain at least one uppercase letter');
            return false;
        }
    }

    removeError(input);
    return true;
}

function showError(input, message) {
    removeError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #ff4444;
        font-size: 12px;
        margin-top: -15px;
        margin-bottom: 10px;
        opacity: 0;
        transform: translateY(-5px);
        transition: all 0.3s ease;
    `;
    errorDiv.textContent = message;
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
    input.style.borderColor = '#ff4444';
    input.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.2)';

    // Trigger animation
    setTimeout(() => {
        errorDiv.style.opacity = '1';
        errorDiv.style.transform = 'translateY(0)';
    }, 10);
}

function removeError(input) {
    const existingError = input.nextSibling;
    if (existingError && existingError.className === 'error-message') {
        existingError.remove();
    }
    input.style.borderColor = '';
    input.style.boxShadow = '';
}

function showSuccess(form) {
    // Remove any existing success messages
    const existingSuccess = form.querySelector('.success-message');
    if (existingSuccess) existingSuccess.remove();

    // Add success styles with animation
    form.style.transition = 'all 0.3s ease';
    form.style.borderColor = '#00ff88';
    form.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3)';

    // Create success message with animation
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        color: #00ff88;
        font-size: 14px;
        text-align: center;
        margin-top: 15px;
        font-weight: bold;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    `;
    successDiv.textContent = 'Success! Redirecting...';
    form.appendChild(successDiv);

    // Trigger animation
    setTimeout(() => {
        successDiv.style.opacity = '1';
        successDiv.style.transform = 'translateY(0)';
    }, 10);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Enhanced tab navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        const form = document.querySelector('.form');
        if (!form) return;

        const focusableElements = form.querySelectorAll('input, button, a');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// Simulate API call
function simulateSubmission() {
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
} 