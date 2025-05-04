document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const seatsParam = urlParams.get('seats');
    const movieTitle = urlParams.get('title');
    const movieImg = urlParams.get('img');
    const date = urlParams.get('date');
    const time = urlParams.get('time');
    const location = urlParams.get('location');

    const selectedSeats = seatsParam ? seatsParam.split(',') : [];

    const selectedSeatsConfirm = document.getElementById('selectedSeatsConfirm');
    if (selectedSeatsConfirm) {
        selectedSeatsConfirm.textContent = `Seats: ${selectedSeats.join(', ')}`;
    }

    const confirmationModal = document.getElementById('confirmationModal');
    if (confirmationModal) {
        confirmationModal.style.display = 'flex';
    }

    const confirmBtn = document.getElementById('confirmBooking');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            document.getElementById('confirmationModal').style.display = 'none';
            document.getElementById('ticketPage').style.display = 'block';
            generateTicket(movieTitle, movieImg, date, time, location, selectedSeats);
        });
    }

    const cancelBtn = document.getElementById('cancelBooking');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            window.history.back();
        });
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

// تعديل الدالة التي تقوم بتوليد التذكرة لتأخذ الوقت الصحيح
function generateTicket(movieTitle, movieImg, date, time, location, selectedSeats) {
  const ticketId = generateRandomTicketId();
  const hallNumber = Math.floor(Math.random() * 5) + 1; // Random hall number between 1-5
  
  // Update movie information
  document.getElementById('movieTitle').textContent = movieTitle || 'Movie Title';
  
  // Update movie poster if available
  if (movieImg && document.getElementById('moviePoster')) {
    document.getElementById('moviePoster').src = movieImg;
  }
  
  // Update ticket details with values from URL parameters
  document.getElementById('ticketDate').textContent = date ? formatDate(date) : 'No date specified';
  document.getElementById('ticketTime').textContent = time || 'No time specified';  // التأكد من استخدام الوقت هنا
  document.getElementById('ticketHall').textContent = `Hall ${hallNumber}`;
  document.getElementById('ticketSeats').textContent = selectedSeats.join(', ');

  // Generate professional barcode
  generateBarcode(ticketId);

  // Get current user
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const userId = currentUser?.email || 'guest';

  // Create ticket object
  const ticket = {
      ticketId,
      movieTitle,
      movieImg,
      date,
      time,  // التأكد من حفظ الوقت في التذكرة
      hall: `Hall ${hallNumber}`,
      location,
      selectedSeats,
      userId,
      createdAt: new Date().toISOString()
  };

  // Save ticket to local storage
  let userTickets = JSON.parse(localStorage.getItem(`tickets_${userId}`)) || [];
  userTickets.push(ticket);
  localStorage.setItem(`tickets_${userId}`, JSON.stringify(userTickets));
}




  
  // Function to generate a professional barcode
  function generateBarcode(ticketId) {
    try {
      JsBarcode("#barcode", ticketId, {

      });
    } catch (e) {
      console.error("Barcode generation error:", e);
      // Fallback if barcode fails
      document.getElementById('barcode').innerHTML = 
        `<div class="barcode-fallback">${ticketId}</div>`;
    }
  }
  
  // Function to generate a random ticket ID
  function generateRandomTicketId() {
    const prefix = "CX"; // CinemaX prefix
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `${prefix}-${randomNum}`;
  }
  
  // Function to format date (Example: 2025-05-01 -> May 1, 2025)
  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid date
      }
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'short' // Add day name (optional)
      };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  }


function generateRandomTicketId() {
    return 'TICKET-' + Math.floor(Math.random() * 1000000);
}

function printTicket() {
    const originalContent = document.body.innerHTML;
    const ticketContent = document.querySelector('.ticket-container').outerHTML;
    document.body.innerHTML = `<div style="padding: 20px; max-width: 800px; margin: 0 auto;">${ticketContent}</div>`;
    window.print();
    document.body.innerHTML = originalContent;
    attachEventListeners();
}

function attachEventListeners() {
    document.getElementById('confirmBooking')?.addEventListener('click', function() {
        document.getElementById('confirmationModal').style.display = 'none';
        document.getElementById('ticketPage').style.display = 'block';
    });

    document.getElementById('cancelBooking')?.addEventListener('click', function() {
        window.history.back();
    });

    const printBtn = document.querySelector('.action-btn.btn-primary');
    if (printBtn) {
        printBtn.addEventListener('click', printTicket);
    }

    const shareBtn = document.querySelector('.action-btn:not(.btn-primary)');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareTicket);
    }
}

function shareTicket() {
    const movieTitle = document.getElementById('movieTitle').textContent;
    const ticketSeats = document.getElementById('ticketSeats').textContent;
    const ticketDate = document.getElementById('ticketDate').textContent;
    const ticketTime = document.getElementById('ticketTime').textContent;

    const shareText = `I've booked tickets for "${movieTitle}" on ${ticketDate} at ${ticketTime}, seats: ${ticketSeats}. See you at CinemaX! 🎬🍿`;

    if (navigator.share) {
        navigator.share({
            title: 'My CinemaX Movie Ticket',
            text: shareText,
            url: window.location.href
        }).then(() => {
            console.log('Shared successfully');
        }).catch((error) => {
            console.error('Error sharing:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert('Ticket information copied to clipboard! You can now paste it.');
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Sharing failed.');
    }
    document.body.removeChild(textarea);
}


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
  ticketBox.style.textAlign = "left"; // محاذاة النص لليمين
  
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
