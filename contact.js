// Form Validation and Submission Handler
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const errors = [];
    const errorContainer = document.getElementById('error-messages');
    errorContainer.innerHTML = '';
    errorContainer.style.display = 'none';

    // Name Validation
    const fullName = document.getElementById('fullName').value.trim();
    if (!fullName) {
        errors.push("❗Full Name is required");
    } else if (!/^[A-Za-z ]{3,50}$/.test(fullName)) {
        errors.push("❌ Name must be 3-50 letters (English only)");
    }

    // Phone Validation
    const phone = document.getElementById('phone').value.trim();
    if (!phone) {
        errors.push("❗Phone Number is required");
    } else if (!/^05\d{8}$/.test(phone)) {
        errors.push("❌ Phone must start with 05 and have 10 digits");
    }

    // Email Validation
    const email = document.getElementById('email').value.trim();
    if (!email) {
        errors.push("❗Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("❌ Invalid email format");
    }

    // Gender Validation
    const gender = document.getElementById('gender').value;
    if (!gender) errors.push("❗Please select gender");

    // Message Validation
    const message = document.getElementById('message').value.trim();
    if (!message) {
        errors.push("❗Message is required");
    } else if (message.length < 10) {
        errors.push("❌ Message must be at least 10 characters");
    }

    // Display Errors if Any
    if (errors.length > 0) {
        errorContainer.innerHTML = `
        <h3>Validation Errors:</h3>
        <ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>
      `;
        errorContainer.style.display = 'block';
        window.scrollTo(0, 0);
    } else {
        alert('Message sent successfully 🎉');
        this.reset();
    }
});

// Toggle Side Menu with Overlay
function toggleSideMenu() {
    const sideMenu = document.getElementById("sideMenu");
    const isOpen = sideMenu.classList.toggle("active");
    
    // Overlay management
    let overlay = document.querySelector('.menu-overlay');
    
    if (isOpen) {
        // Show menu
        document.body.style.overflow = 'hidden'; // Disable scrolling on body

        // Create overlay if not exists
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'menu-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '998';
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';
            document.body.appendChild(overlay);
            
            // Close menu when overlay is clicked
            overlay.addEventListener('click', () => {
                toggleSideMenu();
            });
        }

        overlay.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
    } else {
        // Close menu
        document.body.style.overflow = ''; // Re-enable scrolling

        // Fade out overlay
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300); // Fade duration
        }
    }
}

// Close side menu on pressing 'Escape'
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const sideMenu = document.getElementById("sideMenu");
        if (sideMenu.classList.contains("active")) {
            toggleSideMenu();
        }
    }
});

// Update User UI based on Login Status
function updateUserUI() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const usernameDisplay = document.querySelector('.username');
    const userStatus = document.querySelector('.user-status');
    const loginButton = document.querySelector('.login-button');

    if (currentUser) {
        // User logged in
        usernameDisplay.textContent = currentUser.firstName;
        userStatus.textContent = "Logged in";
        loginButton.textContent = "Sign Out";
        loginButton.href = "#";
        loginButton.onclick = () => {
            sessionStorage.removeItem('currentUser');
            window.location.reload(); // Reload page after logging out
        };
    } else {
        // User logged out (Guest)
        usernameDisplay.textContent = "Guest User";
        userStatus.textContent = "Not logged in";
        loginButton.textContent = "Sign In / Register";
        loginButton.href = "login.html";
        loginButton.onclick = null;
    }
}

// Call updateUserUI when the page loads
window.addEventListener('load', updateUserUI);

// Update slider on window resize (Placeholder function)
window.addEventListener('resize', () => {
    updateSlider();
});
