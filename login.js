document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements
    const loginContainer = document.querySelector('.login-container');
    const registerContainer = document.getElementById('registerContainer');
    const registerLink = document.getElementById('registerLink');
    const backToLogin = document.getElementById('backToLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Get benefits panels
    const memberBenefits = document.getElementById('member-benefits');
    const registrationBenefits = document.getElementById('registration-benefits');
    
    // Password toggle elements
    const passwordToggle = document.getElementById('password-toggle');
    const regPasswordToggle = document.getElementById('reg-password-toggle');
    const regConfirmPasswordToggle = document.getElementById('reg-confirm-password-toggle');
    const passwordField = document.getElementById('password');
    const regPasswordField = document.getElementById('reg-password');
    const regConfirmPasswordField = document.getElementById('reg-confirm-password');
    
    // Initially hide the register container and show member benefits
    registerContainer.style.display = 'none';
    memberBenefits.style.display = 'block';
    registrationBenefits.style.display = 'none';
    
    // Switch to register form
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'flex';
        
        // Switch benefits panel
        memberBenefits.style.display = 'none';
        registrationBenefits.style.display = 'block';
        
        // Reset form fields
        resetFormFields();
    });
    
    // Switch back to login form
    backToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
        
        // Switch benefits panel back
        memberBenefits.style.display = 'block';
        registrationBenefits.style.display = 'none';
        
        // Reset registration form
        resetFormFields();
    });
    
    // Function to reset form fields and icons
    function resetFormFields() {
        // Reset login form
        if (document.getElementById('username')) {
            document.getElementById('username').value = '';
            const usernameIcon = document.getElementById('username-icon');
            if (usernameIcon) {
                const emailIcon = usernameIcon.querySelector('.fa-envelope');
                if (emailIcon) {
                    emailIcon.style.color = '#707070';
                    emailIcon.style.opacity = '1';
                }
            }
        }
        
        if (passwordField) {
            passwordField.value = '';
            const passwordIcon = document.getElementById('password-icon');
            if (passwordIcon) {
                passwordIcon.querySelector('.fa-lock').style.color = '#707070';
            }
        }
        
        // Reset registration form
        registerForm.reset();
        
        // Reset registration form icons
        const formIcons = [
            { id: 'first-name-icon', selector: '.fa-user' },
            { id: 'last-name-icon', selector: '.fa-user' },
            { id: 'reg-email-icon', selector: '.fa-envelope' },
            { id: 'reg-password-icon', selector: '.fa-lock' },
            { id: 'reg-confirm-password-icon', selector: '.fa-lock' }
        ];
        
        formIcons.forEach(icon => {
            const iconElement = document.querySelector(`#${icon.id} ${icon.selector}`);
            if (iconElement) {
                iconElement.style.color = '#707070';
            }
        });
        
        // Reset password eye icons
        document.querySelectorAll('.password-toggle i').forEach(icon => {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        });
        
        // Reset password fields to type password
        if (passwordField) passwordField.setAttribute('type', 'password');
        if (regPasswordField) regPasswordField.setAttribute('type', 'password');
        if (regConfirmPasswordField) regConfirmPasswordField.setAttribute('type', 'password');
        
        // Hide all error messages
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    }
    
    // Password toggle functionality
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            togglePasswordVisibility(passwordField, this);
        });
    }
    
    if (regPasswordToggle) {
        regPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(regPasswordField, this);
        });
    }
    
    if (regConfirmPasswordToggle) {
        regConfirmPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(regConfirmPasswordField, this);
        });
    }
    
    function togglePasswordVisibility(field, toggleElement) {
        if (field && toggleElement) {
            const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
            field.setAttribute('type', type);
            
            // Toggle eye icon
            const icon = toggleElement.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        }
    }
    
    // Login form validation
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Get users from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user exists and password matches
        const user = users.find(user => {
            // Check if username matches email 
            const isEmailMatch = user.email === username;
            return (isEmailMatch) && user.password === password;
        });
        
        if (user) {
            // Login successful
            alert('Login successful! Welcome back, ' + user.firstName);
            
            // Store current user info in session
            sessionStorage.setItem('currentUser', JSON.stringify({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }))
            // Here you would typically redirect to a dashboard or home page
             window.location.href = 'index.html';
        } else {
            // Login failed
            alert('Invalid email or password. Please try again.');
        }
    });
    
    // Register form validation
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('fir-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = regPasswordField.value.trim();
        const confirmPassword = regConfirmPasswordField.value.trim();
        const termsChecked = document.getElementById('terms').checked;
        
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        
        // Validate fields
        let isValid = validateRegistrationForm(firstName, lastName, email, password, confirmPassword, termsChecked);
        
        if (isValid) {
            // Get existing users or create empty array
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if email already exists
            const emailExists = users.some(user => user.email === email);
            
            if (emailExists) {
                document.getElementById('email-error').textContent = 'Email already registered';
                document.getElementById('email-error').style.display = 'block';
                return;
            }
            
            // Add new user
            const newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                registrationDate: new Date().toISOString()
            };
            
            users.push(newUser);
            
            // Save users to local storage
            localStorage.setItem('users', JSON.stringify(users));
            
            sessionStorage.setItem('currentUser', JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
            }));            
            // Registration successful
            alert('Registration successful! You can now Book your favorite movie.');

            // Reset registration form and icons
            resetFormFields();

            window.location.href = 'index.html';
        }
    });
    
    function validateRegistrationForm(firstName, lastName, email, password, confirmPassword, termsChecked) {
        let isValid = true;
        
        // First name validation
        if (firstName === '') {
            document.getElementById('first-name-error').textContent = 'First name is required';
            document.getElementById('first-name-error').style.display = 'block';
            isValid = false;
        } else if (!/^[a-zA-Z]+$/.test(firstName)) {
            document.getElementById('first-name-error').textContent = 'First name can only contain letters';
            document.getElementById('first-name-error').style.display = 'block';
            isValid = false;
        } else if (/\s/.test(firstName)) {
            document.getElementById('first-name-error').textContent = 'First name cannot contain spaces';
            document.getElementById('first-name-error').style.display = 'block';
            isValid = false;
        }
        
        // Last name validation
        if (lastName === '') {
            document.getElementById('last-name-error').textContent = 'Last name is required';
            document.getElementById('last-name-error').style.display = 'block';
            isValid = false;
        } else if (!/^[a-zA-Z]+$/.test(lastName)) {
            document.getElementById('last-name-error').textContent = 'Last name can only contain letters';
            document.getElementById('last-name-error').style.display = 'block';
            isValid = false;
        } else if (/\s/.test(lastName)) {
            document.getElementById('last-name-error').textContent = 'Last name cannot contain spaces';
            document.getElementById('last-name-error').style.display = 'block';
            isValid = false;
        }
        
        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
            document.getElementById('email-error').style.display = 'block';
            isValid = false;
        } else if (/\s/.test(email)) {
            document.getElementById('email-error').textContent = 'Email cannot contain spaces';
            document.getElementById('email-error').style.display = 'block';
            isValid = false;
        }
        
        // Password validation
        if (password.length < 8) {
            document.getElementById('password-error').textContent = 'Password must be at least 8 characters';
            document.getElementById('password-error').style.display = 'block';
            isValid = false;
        } else if (!/[a-z]/.test(password)) {
            document.getElementById('password-error').textContent = 'Password must contain at least one lowercase letter';
            document.getElementById('password-error').style.display = 'block';
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            document.getElementById('password-error').textContent = 'Password must contain at least one uppercase letter';
            document.getElementById('password-error').style.display = 'block';
            isValid = false;
        } else if (!/\d/.test(password)) {
            document.getElementById('password-error').textContent = 'Password must contain at least one number';
            document.getElementById('password-error').style.display = 'block';
            isValid = false;
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            document.getElementById('password-error').textContent = 'Password must contain at least one special character';
            document.getElementById('password-error').style.display = 'block';
            isValid = false;
        }
        
        // Password match validation
        if (password !== confirmPassword) {
            document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
            document.getElementById('confirm-password-error').style.display = 'block';
            isValid = false;
        }
        
        // Terms checkbox validation
        if (!termsChecked) {
            alert('Please agree to the Terms and Conditions');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Setup input field icon color changes
    setupInputIconBehavior();
    
    function setupInputIconBehavior() {
        // Username field icon behavior
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.addEventListener('input', function() {
                const value = this.value.trim();
                const usernameIcon = document.getElementById('username-icon');
                if (usernameIcon) {
                    const emailIcon = usernameIcon.querySelector('.fa-envelope');
                    
                    if (emailIcon) {
                        if (value === '') {
                            emailIcon.style.color = '#707070';
                            emailIcon.style.opacity = '1';
                        } else {
                            emailIcon.style.color = '#e50914';
                            emailIcon.style.opacity = '1';
                        }
                    }
                }
            });
        }
        
        // Password field icon
        if (passwordField) {
            passwordField.addEventListener('input', function() {
                const passwordIcon = document.getElementById('password-icon');
                if (passwordIcon) {
                    const icon = passwordIcon.querySelector('.fa-lock');
                    if (icon) {
                        icon.style.color = this.value.trim() === '' ? '#707070' : '#e50914';
                    }
                }
            });
        }
        
        // Registration form field icons
        const registrationFields = [
            { inputId: 'fir-name', iconId: 'first-name-icon', selector: '.fa-user' },
            { inputId: 'last-name', iconId: 'last-name-icon', selector: '.fa-user' },
            { inputId: 'reg-email', iconId: 'reg-email-icon', selector: '.fa-envelope' },
            { inputId: 'reg-password', iconId: 'reg-password-icon', selector: '.fa-lock' },
            { inputId: 'reg-confirm-password', iconId: 'reg-confirm-password-icon', selector: '.fa-lock' }
        ];
        
        registrationFields.forEach(field => {
            const inputElement = document.getElementById(field.inputId);
            if (inputElement) {
                inputElement.addEventListener('input', function() {
                    const iconElement = document.querySelector(`#${field.iconId} ${field.selector}`);
                    if (iconElement) {
                        iconElement.style.color = this.value.trim() === '' ? '#707070' : '#e50914';
                    }
                });
            }
        });
    }
});
