const seatContainer = document.getElementById("seat-container");
const selectedSeatsElement = document.getElementById("selected-seats");
const seatInfoElement = document.getElementById("seat-info");

// Define the number of seats in each row
const seatCounts = [4, 5, 6, 7]; // 4 rows with different seat counts
const rowLetters = ['A', 'B', 'C', 'D']; // Row labels

// Create seat rows with labels
rowLetters.forEach((rowLetter, rowIndex) => {
  const row = document.createElement("div");
  row.className = "row";
  
  // Add the row label (letter)
  const rowLabel = document.createElement("div");
  rowLabel.className = "row-label";
  rowLabel.textContent = rowLetter;
  row.appendChild(rowLabel);
  
  // Add seats to the row
  const seatCount = seatCounts[rowIndex];
  for (let i = 1; i <= seatCount; i++) {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.dataset.row = rowLetter;
    seat.dataset.number = i;
    seat.dataset.id = `${rowLetter}${i}`;
    seat.textContent = `${rowLetter}${i}`;
    row.appendChild(seat);
  }
  
  seatContainer.appendChild(row);
});
function updateUserUI() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const usernameDisplay = document.querySelector('.username'); // العنصر الموجود في HTML
  const userStatus = document.querySelector('.user-status');
  const loginButton = document.querySelector('.login-button');

  if (currentUser) {
      // حالة تسجيل الدخول
      usernameDisplay.textContent = currentUser.firstName; // عرض الاسم الأول
      userStatus.textContent = "Logged in";
      loginButton.textContent = "Sign Out";
      loginButton.href = "#";
      loginButton.onclick = () => {
          sessionStorage.removeItem('currentUser');
          window.location.reload(); // إعادة تحميل الصفحة بعد تسجيل الخروج
      };
  } else {
      // حالة الضيف
      usernameDisplay.textContent = "Guest User";
      userStatus.textContent = "Not logged in";
      loginButton.textContent = "Sign In / Register";
      loginButton.href = "login.html";
      loginButton.onclick = null;
  }
}

// استدعاء الدالة عند تحميل الصفحة
window.addEventListener('load', updateUserUI);


// Handle seat selection and display selected seats
const confirmBtn = document.querySelector('.confirm-btn');
const selectedSeats = new Set();

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("seat")) {
    const seatId = e.target.dataset.id;
    
    if (e.target.classList.toggle("selected")) {
      // Add seat to the selected seats
      selectedSeats.add(seatId);
    } else {
      // Remove seat from the selected seats
      selectedSeats.delete(seatId);
    }
    
    // Update the selected seats display
    updateSelectedSeatsDisplay();
  }
});

// Function to update the display of selected seats
function updateSelectedSeatsDisplay() {
  if (selectedSeats.size === 0) {
    // Hide the display if no seats are selected
    seatInfoElement.style.display = "none";
    selectedSeatsElement.textContent = "";
  } else {
    // Show the display and update the selected seats
    seatInfoElement.style.display = "inline-block";
    selectedSeatsElement.textContent = "Selected Seats: " + Array.from(selectedSeats).join(', ');
  }
}

// Handle confirmation of selected seats
confirmBtn.addEventListener('click', () => {
  if (selectedSeats.size === 0) {
    alert("Please select at least one seat.");
  } else {
    const seatsParam = Array.from(selectedSeats).join(',');

    // Get movie information from the URL
    const title = new URLSearchParams(window.location.search).get('title') || 'Default Movie';
    const img = new URLSearchParams(window.location.search).get('img') || '/pic/kid.jpeg';
    const date = new URLSearchParams(window.location.search).get('date') || '33333';
    const time = new URLSearchParams(window.location.search).get('time') || '3';
    const location = new URLSearchParams(window.location.search).get('location') || 'AL-Yasmeen Mall';

    // Show loader before navigating
    showLoader();

    setTimeout(() => {
      window.location.href = `ticket.html?seats=${seatsParam}` + 
                            `&title=${encodeURIComponent(title)}` + 
                            `&img=${encodeURIComponent(img)}` + 
                            `&date=${encodeURIComponent(date)}` + 
                            `&time=${encodeURIComponent(time)}` + 
                            `&location=${encodeURIComponent(location)}`;
    }, 2000);
  }
});

// Function to display loading animation
function showLoader() {
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.style.position = 'fixed';
  loader.style.top = 0;
  loader.style.left = 0;
  loader.style.width = '100%';
  loader.style.height = '100%';
  loader.style.backgroundColor = 'rgba(0,0,0,0.8)';
  loader.style.display = 'flex';
  loader.style.justifyContent = 'center';
  loader.style.alignItems = 'center';
  loader.style.zIndex = 9999;
  loader.innerHTML = `<div style="color:white;font-size:24px;">Loading...</div>`;
  document.body.appendChild(loader);
}

// Update the side menu toggle function with a smoother experience
function toggleSideMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const isOpen = sideMenu.classList.toggle("active");
  
  // Manage overlay layer
  let overlay = document.querySelector('.menu-overlay');
  
  if(isOpen) {
    // Show the menu
    document.body.style.overflow = 'hidden'; // Prevent scrolling on the background
    
    // Create overlay if it doesn't exist
    if(!overlay) {
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
      
      // Add event to close the menu when clicking outside
      overlay.addEventListener('click', () => {
        toggleSideMenu();
      });
    }
    
    overlay.style.display = 'block';
    // Slight delay for visual transition
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 10);
    
  } else {
    // Close the menu
    document.body.style.overflow = ''; // Re-enable scrolling
    
    // Hide overlay with fading effect
    if(overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300); // Fade duration
    }
  }
}

// Add event listener to close the menu when pressing ESC key
document.addEventListener('keydown', (event) => {
  if(event.key === 'Escape') {
    const sideMenu = document.getElementById("sideMenu");
    if(sideMenu.classList.contains("active")) {
      toggleSideMenu();
    }
  }
});
