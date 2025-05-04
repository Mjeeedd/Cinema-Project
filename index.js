  const slider = document.getElementById("slider");
  const availableMoviesContainer = document.getElementById("availableMovies");
  const comingSoonMoviesContainer = document.getElementById("comingSoonMovies");
  const searchInput = document.getElementById("searchInput");
  const suggestionsBox = document.getElementById("suggestions");
  const errorPopup = document.getElementById("errorPopup");
  const errorMessage = document.getElementById("errorMessage");
  const sideMenu = document.getElementById("sideMenu");
  let index = 1;
  let currentGenre = "All";
  let slideInterval;

  const movieData = [
    { 
      src: "amat.jpeg", 
      genre: "Action", 
      desc: "THE AMATEUR", 
      status: "now",
      description: "A CIA cryptographer seeks revenge after his wife is killed in a devastating terrorist attack. Consumed by grief and a desire for justice, he enlists the help of a skilled fellow agent to train him in combat and field operations. As he dives deeper into the world of espionage and danger, he risks everything to track down those responsible and make them pay.",
      duration: "112 min",
      cast: ["Rami Malek", "Rachel Brosnahan", "Michael Keaton", "Laurence Fishburne"]
    },
    { 
      src: "bomb.jpeg", 
      genre: "Comedy", 
      desc: "SHABAB AL BOMB 2", 
      status: "now",
      description: "A group of close-knit friends inadvertently stumble upon an old, forgotten bomb in their neighborhood. In their attempt to safely dispose of it, their comedic misadventures spiral out of control, creating chaos wherever they go. As they try to navigate their way through increasingly ridiculous situations, the friends discover unexpected challenges and opportunities for growth.",
      duration: "95 min",
      cast: ["Faisal al-Issa", "Mohannad Al-Jamili", "Abdulaziz Al-Furaihi", "Mohammed Al-Dosari"]
    },
    { 
      src: "jur.jpeg", 
      genre: "Fantasy", 
      desc: "JURASSIC PET", 
      status: "now",
      description: "A young boy discovers a mysterious egg that hatches into a baby dinosaur. As they bond, they must evade scientists who want to capture the rare creature for experiments.",
      duration: "105 min",
      cast: ["Noah Schnapp", "Brooklynn Prince", "Jack Dylan Grazer", "Alfre Woodard"]
    },
    { 
      src: "monk.jpeg", 
      genre: "Horror", 
      desc: "THE MONKEY", 
      status: "now",
      description: "Based on Stephen King's short story, this horror film follows siblings who discover an antique toy monkey that brings death whenever it clashes its cymbals.",
      duration: "116 min",
      cast: ["Sophie Thatcher", "Elijah Wood", "Theo James", "Tatiana Maslany"]
    },
    { 
      src: "moon.jpeg", 
      genre: "Fantasy", 
      desc: "MOON OF PANDA", 
      status: "now",
      description: "An animated adventure following a young panda who embarks on a quest to save the moon after it starts disappearing, threatening his bamboo forest's survival.",
      duration: "98 min",
      cast: ["Noé Liu Martane", "Alexandra Lamy", "Liu Ye", "Sylvia Chang"]
    },
    { 
      src: "until.jpeg", 
      genre: "Horror", 
      desc: "UNTIL DAWN", 
      status: "now",
      description: "Eight friends trapped on a mountain retreat must survive until dawn while being hunted by a supernatural entity awakened by their presence.",
      duration: "122 min",
      cast: ["Anya Taylor-Joy", "Regé-Jean Page", "Glen Powell", "Sydney Sweeney"]
    },
    { 
      src: "sinn.jpeg", 
      genre: "Drama", 
      desc: "SINNERS", 
      status: "now",
      description: "A tense psychological thriller about a small town where residents start revealing dark secrets after a mysterious stranger arrives, testing the limits of forgiveness.",
      duration: "134 min",
      cast: ["Jessica Chastain", "Oscar Isaac", "Jeffrey Wright", "Ruth Negga"]
    },
    { 
      src: "miss.jpeg", 
      genre: "Action", 
      desc: "MISSION IMPOSSIBLE", 
      status: "soon",
      description: "Ethan Hunt and his IMF team race against time to recover stolen advanced AI technology before it falls into the wrong hands and triggers global catastrophe.",
      duration: "145 min",
      cast: ["Tom Cruise", "Rebecca Ferguson", "Simon Pegg", "Vanessa Kirby"]
    },
    { 
      src: "kid.jpeg", 
      genre: "Action", 
      desc: "KARATE KID:LEGENDS", 
      status: "soon",
      description: "A reboot of the classic franchise follows a young prodigy learning karate from a reluctant master to stand up against bullies and compete in a prestigious tournament.",
      duration: "115 min",
      cast: ["Jackie Chan", "Jaden Smith", "Taraji P. Henson", "Ralph Macchio"]
    },
    { 
      src: "lost.jpeg", 
      genre: "Drama", 
      desc: "LOST ON A MOUNTAIN IN MAINE", 
      status: "soon",
      description: "Based on a true story, a 12-year-old boy gets separated from his family during a hiking trip and must survive alone in the wilderness for nine days.",
      duration: "108 min",
      cast: ["Jacob Tremblay", "Woody Harrelson", "Laura Dern", "Finn Wolfhard"]
    }
    
];
// Carousel Update Function: Adjusts the number of visible movies based on screen size
function updateSlider() {
  const totalMovies = movieData.length;
  
  if (totalMovies < 3) {
    slider.innerHTML = `<p style="color: white; text-align: center;">Not enough movies to display</p>`;
    return;
  }
  
  // Get the screen width to determine the number of visible movies
  const screenWidth = window.innerWidth;
  let visibleCount = 5; // Default for large screens
  
  if (screenWidth <= 768) {
    visibleCount = 3; // For medium and small screens
  }
  
  if (screenWidth <= 1200) {
    visibleCount = 3; // For medium screens
  }
  
  // Calculate the indexes for visible movies
  const visibleMovies = [];
  const halfVisible = Math.floor(visibleCount / 2);
  
  // Add visible movies based on the count
  for (let i = -halfVisible; i <= halfVisible; i++) {
    const movieIndex = ((index + i + totalMovies) % totalMovies);
    visibleMovies.push(movieIndex);
  }
  
  // Create movie cards with additional information
  slider.innerHTML = visibleMovies.map((movieIndex, position) => {
    const movie = movieData[movieIndex];
    let cardClass = '';
    
    if (position === halfVisible) {
      cardClass = 'center'; // Center movie
    } else if (position === halfVisible - 1 || position === halfVisible + 1) {
      cardClass = 'near';   // Movies near the center
    }
    
    return `
      <div class="movie-card ${cardClass}" onclick="goToMovie('${movie.src}', '${movie.desc}', '${movie.status}')">
        <img src="${movie.src}" alt="${movie.desc}" />
        <div class="movie-info">
          <h4>${movie.desc}</h4>
          <p>${movie.genre}</p>
          <p class="genre">Click for details</p>
        </div>
      </div>
    `;
  }).join('');
  
  // Add indicators if they are not already present
  if (!document.querySelector('.carousel-indicators')) {
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    
    for (let i = 0; i < totalMovies; i++) {
      const dot = document.createElement('div');
      dot.className = `indicator ${i === index ? 'active' : ''}`;
      dot.onclick = () => {
        index = i;
        updateSlider();
      };
      indicators.appendChild(dot);
    }
    
    document.querySelector('.carousel').appendChild(indicators);
  } else {
    // Update active indicator
    document.querySelectorAll('.indicator').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
}
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

// Event listener to handle window resizing
window.addEventListener('resize', () => {
  updateSlider();
});

// Improved transition for next slide - smoother transition effect
function nextSlide() {
  slider.style.transition = "transform 0.3s ease, opacity 0.3s ease";
  slider.style.transform = "translateX(-15px)";
  slider.style.opacity = "0.8";
  
  setTimeout(() => {
    index = (index + 1) % movieData.length;
    updateSlider();
    
    setTimeout(() => {
      slider.style.transition = "transform 0.3s ease, opacity 0.3s ease";
      slider.style.transform = "translateX(0)";
      slider.style.opacity = "1";
    }, 50);
  }, 250);
}

// Improved transition for previous slide - smoother transition effect
function prevSlide() {
  slider.style.transition = "transform 0.3s ease, opacity 0.3s ease";
  slider.style.transform = "translateX(15px)";
  slider.style.opacity = "0.8";
  
  setTimeout(() => {
    index = (index - 1 + movieData.length) % movieData.length;
    updateSlider();
    
    setTimeout(() => {
      slider.style.transition = "transform 0.3s ease, opacity 0.3s ease";
      slider.style.transform = "translateX(0)";
      slider.style.opacity = "1";
    }, 50);
  }, 250);
}

// Navigate to a movie page with detailed information
function goToMovie(img, title, status) {
  // Search for full movie details
  const movie = movieData.find(m => m.desc === title);
  
  if (!movie) {
    showPopup("Movie information not found!");
    return;
  }
  
  // Navigate to the respective movie page based on its status
  const url = status === "soon"
    ? `coming-soon.html?img=${encodeURIComponent(img)}&title=${encodeURIComponent(title)}&status=${encodeURIComponent(status)}
      &genre=${encodeURIComponent(movie.genre)}&description=${encodeURIComponent(movie.description || 'No description available')}
      &duration=${encodeURIComponent(movie.duration || '120 min')}&cast=${encodeURIComponent(JSON.stringify(movie.cast || []))}`
    : `movie.html?img=${encodeURIComponent(img)}&title=${encodeURIComponent(title)}&status=${encodeURIComponent(status)}
      &genre=${encodeURIComponent(movie.genre)}&description=${encodeURIComponent(movie.description || 'No description available')}
      &duration=${encodeURIComponent(movie.duration || '120 min')}&cast=${encodeURIComponent(JSON.stringify(movie.cast || []))}`;
  
  // Redirect to the movie page
  window.location.href = url;
}

// Automatic carousel slide setup
function setupAutoSlider() {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    nextSlide();
  }, 2000);
}

// Movie search functionality and suggestions
function showSuggestions() {
  const input = searchInput.value.toLowerCase();
  
  // If the search input is empty, hide suggestions
  if (input.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }
  
  // Search for matching movies
  const matchingMovies = movieData.filter(movie => 
    movie.desc.toLowerCase().includes(input) || movie.genre.toLowerCase().includes(input)
  );
  
  // If matching movies are found, display suggestions
  if (matchingMovies.length > 0) {
    const suggestionsHTML = matchingMovies.slice(0, 5).map(movie => 
      `<p onclick="selectSuggestion('${movie.desc}')">${movie.desc} (${movie.genre})</p>`
    ).join('');
    
    suggestionsBox.innerHTML = suggestionsHTML;
    suggestionsBox.style.display = "block";
  } else {
    suggestionsBox.innerHTML = "<p>No movies found</p>";
    suggestionsBox.style.display = "block";
  }
}

// Select a suggestion from the list
function selectSuggestion(title) {
  searchInput.value = title;
  suggestionsBox.style.display = "none";
  searchMovies(); // Perform search immediately after selecting a suggestion
}

// Handle pressing the Enter key in the search input field
function handleEnter(event) {
  if (event.key === "Enter") {
    searchMovies();
  }
}

// Perform movie search and navigate to the booking page
function searchMovies() {
  const searchTerm = searchInput.value.toLowerCase();
  
  if (searchTerm.trim() === "") {
    showPopup("Please enter a movie title!");
    return;
  }
  
  // Search for the movie in the database
  const foundMovie = movieData.find(movie => 
    movie.desc.toLowerCase().includes(searchTerm)
  );
  
  if (foundMovie) {
    // Redirect to the movie page or booking page
    goToMovie(foundMovie.src, foundMovie.desc, foundMovie.status);
  } else {
    showPopup("Movie not found! Please try another title.");
  }
}

// Display error popup with the provided message
function showPopup(message) {
  errorMessage.textContent = message;
  errorPopup.style.display = "block";
}

// Close the error popup
function closePopup() {
  errorPopup.style.display = "none";
}

// Event listener to close the suggestions box if clicked outside
document.addEventListener('click', function(event) {
  if (!suggestionsBox.contains(event.target) && event.target !== searchInput) {
    suggestionsBox.style.display = "none";
  }
});

// Update Movie Sections Function: Displays available and upcoming movies without the "Show More" button
function updateMovieSections() {
  // Filter currently available movies
  const availableMovies = movieData.filter(movie => 
    movie.status === "now" && (currentGenre === 'All' || movie.genre === currentGenre));
  
  // Filter upcoming movies
  const comingSoonMovies = movieData.filter(movie => 
    movie.status === "soon" && (currentGenre === 'All' || movie.genre === currentGenre));

  // Display available movies without the "Show More" button
  if (availableMovies.length > 0) {
    // Generate HTML for displaying the movies
    const moviesHTML = availableMovies.map(movie =>
      `<div class="movie-card" onclick="goToMovie('${movie.src}', '${movie.desc}', '${movie.status}')">
        <img src="${movie.src}" alt="${movie.desc}" />
        <div class="movie-info">
          <h4>${movie.desc}</h4>
          <p>${movie.genre}</p>
          <p class="genre">Now Showing</p>
        </div>
      </div>`).join('');

    // Insert the movie cards into the container
    availableMoviesContainer.innerHTML = moviesHTML;
    
    // Remove the 'collapsed' class to allow full display
    availableMoviesContainer.classList.remove('collapsed');
    
    // Remove the "Show More" button if it exists
    const showMoreBtn = document.querySelector('#show-more-available');
    if (showMoreBtn) {
      showMoreBtn.remove();
    }
  } else {
    availableMoviesContainer.innerHTML = `<p style="text-align: center; width: 100%; grid-column: span 3;">No movies available in this category</p>`;
  }

  // Display upcoming movies without the "Show More" button
  if (comingSoonMovies.length > 0) {
    // Generate HTML for displaying the movies
    const moviesHTML = comingSoonMovies.map(movie =>
      `<div class="movie-card" onclick="goToMovie('${movie.src}', '${movie.desc}', '${movie.status}')">
        <img src="${movie.src}" alt="${movie.desc}" />
        <div class="movie-info">
          <h4>${movie.desc}</h4>
          <p>${movie.genre}</p>
          <p class="genre">Coming Soon</p>
        </div>
      </div>`).join('');

    // Insert the movie cards into the container
    comingSoonMoviesContainer.innerHTML = moviesHTML;
    
    // Remove the 'collapsed' class to allow full display
    comingSoonMoviesContainer.classList.remove('collapsed');
    
    // Remove the "Show More" button if it exists
    const showMoreBtn = document.querySelector('#show-more-coming');
    if (showMoreBtn) {
      showMoreBtn.remove();
    }
  } else {
    comingSoonMoviesContainer.innerHTML = `<p style="text-align: center; width: 100%; grid-column: span 3;">No upcoming movies in this category</p>`;
  }
}

// Remove the 'toggleMoviesDisplay' function as it is no longer required
// function toggleMoviesDisplay(containerId) { . }

// Initialization when the page loads - without adding the 'collapsed' class
window.addEventListener('load', () => {
updateSlider();
setupAutoSlider();
updateMovieSections();

// Remove 'collapsed' class from containers on startup
document.getElementById('availableMovies').classList.remove('collapsed');
document.getElementById('comingSoonMovies').classList.remove('collapsed');

// Stop automatic playback when hovering over the carousel
document.querySelector('.carousel').addEventListener('mouseenter', () => {
  clearInterval(slideInterval);
});

// Resume automatic playback when leaving the carousel
document.querySelector('.carousel').addEventListener('mouseleave', () => {
  setupAutoSlider();
});

// Apply additional interactive effects when scrolling
window.addEventListener('scroll', () => {
  const movieSections = document.querySelectorAll('.movie-section > div');
  
  movieSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if(isVisible) {
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
    } else {
      section.style.opacity = "0.7";
      section.style.transform = "translateY(20px)";
    }
  });
});

// Apply initial transition effects
document.querySelectorAll('.movie-section > div').forEach(section => {
  section.style.transition = "all 0.5s ease";
});
});

// Replace the old 'toggleSideMenu' function with this enhanced version

function toggleSideMenu() {
const sideMenu = document.getElementById("sideMenu");
const isOpen = sideMenu.classList.toggle("active");

// Manage the overlay layer
let overlay = document.querySelector('.menu-overlay');

if(isOpen) {
  // Show the menu
  document.body.style.overflow = 'hidden'; // Prevent scrolling on the background
  
  // Create an overlay layer if it doesn't exist
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
    
    // Add click event to close the menu when clicking outside
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
  // Close the menu
  document.body.style.overflow = ''; // Re-enable scrolling
  
  // Hide the overlay with a fading effect
  if(overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300); // Fade duration
  }
}
}

// Add event listener to close the menu when pressing the ESC key
document.addEventListener('keydown', (event) => {
if(event.key === 'Escape') {
  const sideMenu = document.getElementById("sideMenu");
  if(sideMenu.classList.contains("active")) {
    toggleSideMenu();
  }
}
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
    <img src="${ticket.movieImage}" alt="Movie Poster" style="width: 100%; height: 100%; object-fit: cover; display: block;">
  </div>
`;

  
  document.body.appendChild(ticketBox);
  
});
