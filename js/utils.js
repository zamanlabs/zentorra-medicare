/**
 * Zentorra Medicare Utility Functions
 * Common utilities shared across all pages
 */

// Handle image loading errors
function handleImageErrors() {
  const images = document.querySelectorAll('img:not(.no-fallback)');
  
  images.forEach(img => {
    // Add fallback class to prepare for error handling
    img.classList.add('fallback-ready');
    
    // Handle error when image fails to load
    img.onerror = function() {
      // For team member images
      if (img.classList.contains('team-member-img')) {
        img.classList.add('missing-img');
        // Don't show broken image
        img.style.display = 'none';
        
        // Create a placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'team-member-img missing-img';
        placeholder.innerHTML = '<i class="fas fa-user fa-3x"></i>';
        img.parentNode.appendChild(placeholder);
      } 
      // For avatar images
      else if (img.classList.contains('avatar')) {
        // Create initials placeholder
        const parent = img.parentNode;
        const placeholder = document.createElement('div');
        placeholder.className = 'avatar-placeholder';
        
        // Try to get name from alt text or use "ZM"
        const initials = img.alt ? img.alt.split(' ').map(name => name[0]).join('').substring(0, 2) : 'ZM';
        placeholder.textContent = initials;
        
        // Replace image with placeholder
        parent.replaceChild(placeholder, img);
      }
      // For other images
      else {
        // Create a general placeholder
        const parent = img.parentNode;
        const placeholder = document.createElement('div');
        placeholder.className = 'img-placeholder';
        placeholder.style.width = img.width ? img.width + 'px' : '100%';
        placeholder.style.height = img.height ? img.height + 'px' : '200px';
        placeholder.innerHTML = '<i class="fas fa-image"></i>';
        
        // Replace image with placeholder
        parent.replaceChild(placeholder, img);
      }
    };
  });
}

// Handle navigation active state
function setActiveNavItem() {
  const currentPath = window.location.pathname;
  const filename = currentPath.split('/').pop();
  
  // Get all navigation links
  const navLinks = document.querySelectorAll('#side-panel nav a');
  
  navLinks.forEach(link => {
    // Remove active class from all links
    link.classList.remove('active');
    
    // Get href attribute
    const href = link.getAttribute('href');
    
    // Check if href matches current page
    if (href === filename || 
        (filename === '' && href === 'index.html') ||
        (href === currentPath)) {
      link.classList.add('active');
    }
  });
}

// Show notification
function showNotification(message, type = 'info', duration = 3000) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add to the DOM
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Remove after duration
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-10px)';
    
    // Remove from DOM after animation
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, duration);
}

// Format date for display
function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

// Format time for display
function formatTime(time) {
  return new Date(time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// Handle tooltip initialization
function initTooltips() {
  const tooltips = document.querySelectorAll('.tooltip');
  
  tooltips.forEach(tooltip => {
    const tooltipText = tooltip.getAttribute('data-tooltip');
    if (tooltipText) {
      const span = document.createElement('span');
      span.className = 'tooltip-text';
      span.textContent = tooltipText;
      tooltip.appendChild(span);
    }
  });
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
  handleImageErrors();
  setActiveNavItem();
  initTooltips();
  
  // Initialize side panel toggle
  const menuToggle = document.getElementById('menu-toggle');
  const sidePanel = document.getElementById('side-panel');
  
  if (menuToggle && sidePanel) {
    menuToggle.addEventListener('click', function() {
      sidePanel.classList.toggle('hidden');
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', function(event) {
      if (!sidePanel.contains(event.target) && event.target !== menuToggle) {
        if (!sidePanel.classList.contains('hidden') && window.innerWidth < 1024) {
          sidePanel.classList.add('hidden');
        }
      }
    });
  }
}); 