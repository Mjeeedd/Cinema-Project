// Function to extract information from the URL parameters
function extractMovieInfo() {
  const params = new URLSearchParams(window.location.search);
  
  const title = params.get('title');
  const img = params.get('img');
  const genre = params.get('genre');
  const description = params.get('description');
  const duration = params.get('duration');
  let cast = [];
  
  // Attempt to parse the 'cast' parameter into an array
  try {
    cast = JSON.parse(params.get('cast') || '[]');
  } catch (e) {
    console.error('Error parsing cast data:', e);
  }

  // Display basic movie information
  document.getElementById('movieTitle').innerText = title || 'Movie Title';
  document.getElementById('movieImg').src = img || '/api/placeholder/250/375?text=Movie';
  document.getElementById('movieGenre').innerText = genre || 'Genre not specified';
  document.getElementById('movieDescription').innerText = description || 'No description available.';
  document.getElementById('movieDuration').innerText = duration || '120 min';

  // Create and display the cast list
  const castList = document.getElementById('castList');
  if (cast && cast.length > 0) {
    cast.forEach(actor => {
      const listItem = document.createElement('li');
      listItem.className = 'cast-item';
      listItem.innerText = actor;
      castList.appendChild(listItem);
    });
  } else {
    const listItem = document.createElement('li');
    listItem.className = 'cast-item';
    listItem.innerText = 'Cast information not available';
    castList.appendChild(listItem);
  }

  // Store essential movie information for seat selection page
  document.getElementById('hiddenTitle').value = title;
  document.getElementById('hiddenImg').value = img;

  // Apply visual effects for the cast list items when the page loads
  window.addEventListener('load', () => {
    document.querySelectorAll('.cast-item').forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50);
      }, index * 100);
    });
  });
}

// Function to populate the date selection list with the next 5 days
// Function to populate the date selection list with static dates from 3rd May to 7th May
function populateDateOptions() {
  const dateSelect = document.getElementById('date');
  const dates = [
    { value: '2025-05-03', label: 'May 3, 2025' },
    { value: '2025-05-04', label: 'May 4, 2025' },
    { value: '2025-05-05', label: 'May 5, 2025' },
    { value: '2025-05-06', label: 'May 6, 2025' },
    { value: '2025-05-07', label: 'May 7, 2025' }
  ];

  dates.forEach(date => {
    const option = document.createElement('option');
    option.value = date.value;
    option.textContent = date.label;
    dateSelect.appendChild(option);
  });
}
// Function to populate the time selection list with static times
function populateTimeOptions() {
  const timeSelect = document.getElementById('time');
  const times = [
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  times.forEach(time => {
    const option = document.createElement('option');
    option.value = time;
    option.textContent = time;
    timeSelect.appendChild(option);
  });
}

// Execute the date population function when the page is loaded
window.onload = function() {
  extractMovieInfo();
  populateDateOptions();
  populateTimeOptions();
};

// Function to toggle the side menu visibility
function toggleSideMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const isOpen = sideMenu.classList.toggle("active");
  
  // Manage the overlay layer
  let overlay = document.querySelector('.menu-overlay');
  
  if (isOpen) {
    // Show the menu
    document.body.style.overflow = 'hidden'; // Prevent scrolling on the background
    
    // Create overlay if it doesn't exist
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
      
      // Add click event to close the menu when clicking outside
      overlay.addEventListener('click', () => {
        toggleSideMenu();
      });
    }
    
    overlay.style.display = 'block';
    // Delay to apply the visual transition
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 10);
  } else {
    // Close the menu
    document.body.style.overflow = ''; // Re-enable scrolling
    
    // Fade out the overlay
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300); // Duration of fade-out effect
    }
  }
}

// Event listener to close the side menu when pressing the Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const sideMenu = document.getElementById("sideMenu");
    if (sideMenu.classList.contains("active")) {
      toggleSideMenu();
    }
  }
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

// Check if the user is logged in before showing the seat selection button
document.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the default form submission
  
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const seatSelectionButton = document.getElementById("seatSelectionButton");
  
  if (!currentUser) {
    document.getElementById("loginModal").style.display = "flex";
  } else {
    // Redirect to the seat selection page
  window.location.href = "seats.html?title=" + encodeURIComponent(document.getElementById('hiddenTitle').value) + "&img=" + encodeURIComponent(document.getElementById('hiddenImg').value) + "&date=" + document.getElementById('date').value;
  }
}
);
function closeModal() {
  document.getElementById("loginModal").style.display = "none";
};
function goToLogin() {
  window.location.href = "login.html"; // غير الرابط حسب موقعك
};