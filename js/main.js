// DOM Elements
const sidePanel = document.getElementById('side-panel');
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const overlay = document.getElementById('overlay');

// Toggle side panel
menuToggle.addEventListener('click', function() {
    sidePanel.classList.remove('-translate-x-full');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-50', 'pointer-events-auto');
    document.body.classList.add('overflow-hidden', 'lg:overflow-auto');
    
    // Scroll active menu item into view after menu opens
    setTimeout(() => {
        const activeMenuItem = sidePanel.querySelector('li.bg-blue-50');
        if (activeMenuItem) {
            activeMenuItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 300);
});

// Close side panel
closeMenu.addEventListener('click', function() {
    closeSidePanel();
});

// Close side panel when clicking overlay
overlay.addEventListener('click', function() {
    closeSidePanel();
});

// Function to close the side panel
function closeSidePanel() {
    sidePanel.classList.add('-translate-x-full');
    overlay.classList.remove('opacity-50', 'pointer-events-auto');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden', 'lg:overflow-auto');
}

// Close side panel when clicking outside
document.addEventListener('click', function(event) {
    if (!sidePanel.contains(event.target) && !menuToggle.contains(event.target)) {
        closeSidePanel();
    }
});

// Handle navigation links
const navLinks = document.querySelectorAll('#side-panel nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // If we're in mobile view, prevent default behavior and close menu first
        if (window.innerWidth < 1024) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Close the side panel with animation
            closeSidePanel();
            
            // Navigate to the new page after menu closes
            if (href !== '#') {
                setTimeout(() => {
                    window.location.href = href;
                }, 300); // Match transition duration
            }
        }
    });
});

// Handle active navigation item
const currentPath = window.location.pathname;
const currentPage = currentPath.split('/').pop() || 'index.html';

navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPage) {
        link.parentElement.classList.add('bg-blue-50');
        link.classList.remove('text-gray-700', 'hover:text-blue-500');
        link.classList.add('text-blue-500');
    } else {
        link.parentElement.classList.remove('bg-blue-50');
        link.classList.remove('text-blue-500');
        link.classList.add('text-gray-700', 'hover:text-blue-500');
    }
});

// Handle sign in button
const signInBtn = document.querySelector('header button');
if (signInBtn) {
    signInBtn.addEventListener('click', function() {
        // Add sign in functionality here
        console.log('Sign in clicked');
    });
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add responsive behavior for tables
const tables = document.querySelectorAll('table');
tables.forEach(table => {
    const wrapper = document.createElement('div');
    wrapper.className = 'overflow-x-auto';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
});

// Add loading state for buttons
document.querySelectorAll('button[type="submit"]').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('opacity-75', 'cursor-not-allowed');
        this.disabled = true;
    });
});

// Handle form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add form submission handling here
        console.log('Form submitted');
    });
});

// Add tooltips
const tooltipElements = document.querySelectorAll('[data-tooltip]');
tooltipElements.forEach(element => {
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full mb-2 hidden';
    tooltip.textContent = element.getAttribute('data-tooltip');
    element.appendChild(tooltip);

    element.addEventListener('mouseenter', function() {
        tooltip.classList.remove('hidden');
    });

    element.addEventListener('mouseleave', function() {
        tooltip.classList.add('hidden');
    });
});

// Add notification system
window.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// Add error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'images/placeholder.png';
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSidePanel();
    }
    
    // Tab trap inside sidebar when it's open
    if (e.key === 'Tab' && !sidePanel.classList.contains('-translate-x-full')) {
        const focusableElements = sidePanel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Shift+Tab on first element should go to last element
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } 
        // Tab on last element should go to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// Ensure all navigation links have proper href attributes
const navigationLinks = document.querySelectorAll('nav a');
navigationLinks.forEach(link => {
    if (!link.getAttribute('href')) {
        link.setAttribute('href', '#');
    }
});

// Sample data for demonstration (in a real app, this would come from an API or backend)
const healthMetrics = {
    wellnessScore: 87,
    symptoms: [
        { name: 'Headache', severity: 'Mild', date: '2025-04-10' },
        { name: 'Fatigue', severity: 'Moderate', date: '2025-04-12' }
    ],
    profileCompletion: 65
};

// Function to simulate fetching nearby hospitals (in a real app, would use Geolocation API)
function fetchNearbyHospitals() {
    return [
        { name: 'Mercy General Hospital', distance: '1.2 miles', phone: '555-123-4567' },
        { name: 'City Medical Center', distance: '2.8 miles', phone: '555-987-6543' },
        { name: 'University Hospital', distance: '3.5 miles', phone: '555-456-7890' }
    ];
}

// Demo function for AI health assistant chat
function initializeAIChat() {
    const aiResponses = {
        'hello': 'Hello! How can I assist with your health today?',
        'headache': 'For headaches, ensure you\'re hydrated and consider taking a break from screens. If it persists for more than 24 hours or is severe, please consult a doctor.',
        'emergency': 'If this is a medical emergency, please call 911 immediately. Do not wait for a response here.',
        'medication': 'Always take medications as prescribed by your doctor. Would you like me to set a reminder for your medication?'
    };
    
    // This would be expanded in a real application with actual AI capabilities
    console.log('AI Health Assistant initialized and ready to help');
    return aiResponses;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Zentorra Medicare app initialized');
    
    // Initialize AI assistant
    const aiAssistant = initializeAIChat();
    
    // Get nearby hospitals (would be shown when emergency button is clicked)
    const nearbyHospitals = fetchNearbyHospitals();

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add responsive behavior for tables
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.className = 'overflow-x-auto';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });

    // Add loading state for buttons
    document.querySelectorAll('button[type="submit"]').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('opacity-75', 'cursor-not-allowed');
            this.disabled = true;
        });
    });

    // Handle form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form submission handling here
            console.log('Form submitted');
        });
    });

    // Add tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full mb-2 hidden';
        tooltip.textContent = element.getAttribute('data-tooltip');
        element.appendChild(tooltip);

        element.addEventListener('mouseenter', function() {
            tooltip.classList.remove('hidden');
        });

        element.addEventListener('mouseleave', function() {
            tooltip.classList.add('hidden');
        });
    });

    // Add notification system
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
        } text-white`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    // Add error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'images/placeholder.png';
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            sidePanel.classList.add('-translate-x-full');
        }
    });
}); 