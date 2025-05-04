// Get parameters from URL
const params = new URLSearchParams(window.location.search);

// Extract movie information from URL parameters
const title = params.get("title");
const img = params.get("img");
const genre = params.get("genre");
const duration = params.get("duration");
const description = params.get("description");
const castData = params.get("cast");

// Set movie details to the respective elements
document.getElementById("movieTitle").textContent = title || "Coming Soon";
document.getElementById("movieImg").src = img || "default.jpg";
document.getElementById("movieGenre").textContent = genre || "Not Specified";
document.getElementById("movieDuration").textContent = duration || "TBA";
document.getElementById("movieDescription").textContent = description || "Description not available.";

// Handle the movie cast list
const castList = document.getElementById("castList");
let cast = [];

// Try to parse the cast data (JSON format)
try {
  cast = JSON.parse(castData);
} catch (e) {
  cast = [];
}

// If the cast list exists, display the names, otherwise show a default message
if (Array.isArray(cast) && cast.length > 0) {
  cast.forEach(member => {
    const div = document.createElement("div");
    div.className = "cast-item";
    div.textContent = member;
    castList.appendChild(div);
  });
} else {
  const div = document.createElement("div");
  div.className = "cast-item";
  div.textContent = "Cast not announced yet.";
  castList.appendChild(div);
}

// Toggle side menu visibility with overlay management
function toggleSideMenu() {
  const sideMenu = document.getElementById("sideMenu");
  const isOpen = sideMenu.classList.toggle("active");

  // Handle overlay layer
  let overlay = document.querySelector('.menu-overlay');

  if (isOpen) {
    // Show the side menu and prevent scrolling on the body
    document.body.style.overflow = 'hidden'; 

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
      
      // Close the menu when clicking on the overlay
      overlay.addEventListener('click', () => {
        toggleSideMenu();
      });
    }

    overlay.style.display = 'block';
    // Delay slightly to apply the visual transition
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 10);

  } else {
    // Close the side menu and allow scrolling again
    document.body.style.overflow = ''; 

    // Hide overlay with a fading effect
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300); // Fade duration
    }
  }
}

// Add an event listener for closing the menu with the ESC key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const sideMenu = document.getElementById("sideMenu");
    if (sideMenu.classList.contains("active")) {
      toggleSideMenu();
    }
  }
});
