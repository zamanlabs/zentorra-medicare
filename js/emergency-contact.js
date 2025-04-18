/**
 * Zentorra Medicare - Emergency Contact Module
 * Handles emergency contact management and location functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Emergency contacts array
  let emergencyContacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
  
  // Location tracking variables
  let locationCoords = null;
  
  // Listen for location updates from the LocationMapManager
  document.addEventListener('locationUpdated', function(event) {
    locationCoords = {
      lat: event.detail.lat,
      lng: event.detail.lng
    };
  });
  
  // SOS button action
  document.querySelector('.sos-button')?.addEventListener('click', function() {
    if (locationCoords) {
      // If we have coordinates, use them for emergency call
      alert(`Emergency services would be contacted with your location: ${document.getElementById('location-name').textContent}`);
      // In a real app, this would connect to emergency services API
      window.location.href = 'tel:999';
    } else {
      // Fallback to just calling emergency without location
      alert('Connecting to emergency services...');
      window.location.href = 'tel:999';
    }
  });
  
  // Emergency call button in banner
  const emergencyCallBtn = document.getElementById('emergency-call');
  if (emergencyCallBtn) {
    emergencyCallBtn.addEventListener('click', function() {
      window.location.href = 'tel:999';
    });
  }
  
  // Add contact button
  const addContactBtn = document.getElementById('add-contact-btn');
  if (addContactBtn) {
    addContactBtn.addEventListener('click', addEmergencyContact);
  }
  
  // Initialize by rendering existing contacts
  renderEmergencyContacts();
  
  // Hospital direction buttons
  document.querySelectorAll('.hospital-directions').forEach(button => {
    button.addEventListener('click', function() {
      // We'll use the LocationMapManager for this now
      // This is handled automatically by the initialization in leaflet-location.js
    });
  });
  
  // Emergency contact functions
  function addEmergencyContact() {
    const nameInput = document.getElementById('contact-name');
    const numberInput = document.getElementById('contact-number');
    
    // Validate inputs
    if (!nameInput.value.trim() || !numberInput.value.trim()) {
      alert('Please enter both name and phone number');
      return;
    }
    
    // Create new contact
    const newContact = {
      id: Date.now(), // Use timestamp as unique ID
      name: nameInput.value.trim(),
      number: numberInput.value.trim()
    };
    
    // Add to array and save to localStorage
    emergencyContacts.push(newContact);
    localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
    
    // Clear inputs
    nameInput.value = '';
    numberInput.value = '';
    
    // Update the UI
    renderEmergencyContacts();
  }
  
  // Render emergency contacts from localStorage
  function renderEmergencyContacts() {
    const contactList = document.getElementById('contact-list');
    if (!contactList) return;
    
    // Clear current list
    contactList.innerHTML = '';
    
    // Check if we have any contacts
    if (emergencyContacts.length === 0) {
      contactList.innerHTML = `
        <li class="empty-contacts">
          <span>No emergency contacts added yet</span>
        </li>
      `;
      return;
    }
    
    // Render each contact
    emergencyContacts.forEach(contact => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <p class="contact-name">${contact.name}</p>
          <p class="contact-number">${contact.number}</p>
        </div>
        <div class="contact-actions">
          <button class="call-button" data-number="${contact.number}" aria-label="Call contact">
            <i class="fas fa-phone"></i>
          </button>
          <button class="delete-button" data-id="${contact.id}" aria-label="Delete contact">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      contactList.appendChild(li);
      
      // Add event listeners for the buttons
      li.querySelector('.call-button').addEventListener('click', function() {
        window.location.href = `tel:${this.getAttribute('data-number')}`;
      });
      
      li.querySelector('.delete-button').addEventListener('click', function() {
        const contactId = parseInt(this.getAttribute('data-id'));
        deleteEmergencyContact(contactId);
      });
    });
  }
  
  // Delete an emergency contact
  function deleteEmergencyContact(contactId) {
    if (confirm('Are you sure you want to delete this contact?')) {
      // Filter out the contact to delete
      emergencyContacts = emergencyContacts.filter(contact => contact.id !== contactId);
      
      // Save to localStorage
      localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
      
      // Update the UI
      renderEmergencyContacts();
    }
  }
}); 