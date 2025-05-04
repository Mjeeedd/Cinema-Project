// Wait for DOM to be fully loaded before executing script
document.addEventListener('DOMContentLoaded', function() {
  initFaqAccordion(); 
  initStatCounters();
});
// Initialize FAQ accordion functionality
function initFaqAccordion() {
  // Find all FAQ items on the page
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const icon = item.querySelector('.faq-toggle i');
    
    question.addEventListener('click', () => {
      // Toggle active state on clicked item
      const isActive = item.classList.toggle('active');
      
      // Update icon based on active state (minus when open, plus when closed)
      icon.className = isActive ? 'fas fa-minus' : 'fas fa-plus';
      
      // Close other open FAQ items when opening a new one
      if (isActive) {
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-toggle i').className = 'fas fa-plus';
          }
        });
      }
    });
  });
}
 // Initialize animated statistics counters
function initStatCounters() {
  // Find all statistic counters on the page
  const statCounters = document.querySelectorAll('.stat-count');
  
  statCounters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count')); // Target value from data attribute
    let count = 0; // Starting count
    const duration = 2000; 
    const frameRate = 16; 
    const increment = target / (duration / frameRate); // Calculate how much to increment each frame
    
    const updateCounter = () => {
      count += increment;
      
      if (count >= target) {
        // Animation complete, set final value with plus sign
        counter.textContent = target + '+';
        return;
      }
      
      // Update counter with current value (no plus sign during animation)
      counter.textContent = Math.floor(count);
      requestAnimationFrame(updateCounter); // Request next animation frame
    };
    
    requestAnimationFrame(updateCounter); // Start the animation
  });
}
