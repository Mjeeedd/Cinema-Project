// Improved toggleSideMenu function
function toggleSideMenu() {
    const sideMenu = document.getElementById("sideMenu");
    const isOpen = sideMenu.classList.toggle("active");

    // Manage the overlay layer
    let overlay = document.querySelector('.menu-overlay');

    if (isOpen) {
        // Show the side menu
        document.body.style.overflow = 'hidden'; // Disable scrolling on the background
        
        // Create overlay if not present
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

            // Add click event to close the side menu when clicking outside
            overlay.addEventListener('click', () => {
                toggleSideMenu();
            });
        }

        overlay.style.display = 'block';
        // Slight delay to apply visual transition
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);

    } else {
        // Close the side menu
        document.body.style.overflow = ''; // Re-enable scrolling

        // Hide the overlay with fade-out effect
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300); // Fade duration
        }
    }
}

// Event listener to close the side menu when pressing the ESC key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const sideMenu = document.getElementById("sideMenu");
        if (sideMenu.classList.contains("active")) {
            toggleSideMenu();
        }
    }
});

// Function to update the UI based on the login status
function updateUserUI() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const usernameDisplay = document.querySelector('.username');
    const userStatus = document.querySelector('.user-status');
    const loginButton = document.querySelector('.login-button');

    if (currentUser) {
        // Logged-in state
        usernameDisplay.textContent = currentUser.firstName; // Display first name
        userStatus.textContent = "Logged in";
        loginButton.textContent = "Sign Out";
        loginButton.href = "#";
        loginButton.onclick = () => {
            sessionStorage.removeItem('currentUser');
            window.location.reload(); // Reload the page after logging out
        };
    } else {
        // Guest state
        usernameDisplay.textContent = "Guest User";
        userStatus.textContent = "Not logged in";
        loginButton.textContent = "Sign In / Register";
        loginButton.href = "login.html";
        loginButton.onclick = null;
    }
}

// Call the function when the page loads
window.addEventListener('load', updateUserUI);

// Add event listener for window resize to adjust the UI (if necessary)
window.addEventListener('resize', () => {
    updateSlider();
});
// Handle My Tickets Button
document.getElementById("myTicketsBtn")?.addEventListener("click", function () {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    
    if (!currentUser || currentUser.id === "guest") {
      alert("You must login first.");
      return;
    }
  
    const tickets = JSON.parse(localStorage.getItem(`tickets_${currentUser.email}`)) || [];
    
    if (tickets.length === 0) {
      alert("You have no tickets saved.");
      return;
    }
  
    const ticket = tickets[tickets.length - 1]; // آخر تذكرة محفوظة
  
    const ticketBox = document.createElement("div");
    ticketBox.style.position = "fixed";
    ticketBox.style.top = "50%";
    ticketBox.style.left = "50%";
    ticketBox.style.transform = "translate(-50%, -50%)";
    ticketBox.style.backgroundColor = "#8B0000";
    ticketBox.style.borderRadius = "12px";
    ticketBox.style.boxShadow = "0 0 15px rgba(0,0,0,0.4)";
    ticketBox.style.zIndex = 9999;
    ticketBox.style.display = "flex";
    ticketBox.style.flexDirection = "row";
    ticketBox.style.width = "600px";
    ticketBox.style.maxWidth = "90%";
    ticketBox.style.overflow = "hidden";
    ticketBox.style.color = "#fff";
    ticketBox.style.fontFamily = "Arial, sans-serif";
    
    // الداخل مقسوم لجزئين
    ticketBox.innerHTML = `
      <div style="flex: 1.5; padding: 25px;">
        <h3 style="margin-top: 0;">🎟️ Your Ticket</h3>
        <p><strong>Film Name:</strong> ${ticket.movieTitle}</p>
        <p><strong>Date:</strong> ${ticket.date}</p>
        <p><strong>Time:</strong> ${ticket.time}:00 PM</p>
        <p><strong>Hall:</strong> ${ticket.hall}</p>
        <p><strong>Location:</strong> ${ticket.location}</p>
        <p><strong>Seats:</strong> ${ticket.selectedSeats.join(', ')}</p>
        <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
        <button style="margin-top: 15px; padding: 8px 16px; background:#fff; color:#8B0000; border:none; border-radius:5px; font-weight: bold; cursor:pointer;" onclick="this.closest('div').parentElement.remove()">Close</button>
      </div>
      <div style="flex: 1; background-color: #000;">
        <img src="aa.jpeg" alt="Movie Poster" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      </div>
    `;
    
    document.body.appendChild(ticketBox);
    
  });
  