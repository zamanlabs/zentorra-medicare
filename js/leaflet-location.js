/**
 * Zentorra Medicare - Leaflet Map Location Module
 * Handles interactive map rendering with precise location tracking
 */

class LocationMapManager {
  constructor(mapElementId, locationTextElementId, refreshButtonId) {
    // Store element references
    this.mapElement = document.getElementById(mapElementId);
    this.locationText = document.getElementById(locationTextElementId);
    this.refreshButton = document.getElementById(refreshButtonId);
    
    // Initialize state variables
    this.map = null;
    this.marker = null;
    this.circle = null;
    this.zoomed = false;
    this.locationCoords = null;
    
    // Bind methods to maintain 'this' context
    this.initMap = this.initMap.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
    this.handleLocationSuccess = this.handleLocationSuccess.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
    this.updateLocationDisplay = this.updateLocationDisplay.bind(this);
    this.getHospitalsNearby = this.getHospitalsNearby.bind(this);
    
    // Set up refresh button event listener if element exists
    if (this.refreshButton) {
      this.refreshButton.addEventListener('click', () => {
        this.getCurrentLocation();
      });
    }
  }
  
  /**
   * Initialize the Leaflet map in the specified element
   */
  initMap() {
    // Create map instance if not already created
    if (!this.map && this.mapElement) {
      // Default view (will be updated when location is obtained)
      this.map = L.map(this.mapElement).setView([23.8103, 90.4125], 13); // Default to Dhaka, Bangladesh
      
      // Add the tile layer (map visuals)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
      
      // Get user's current location
      this.getCurrentLocation();
    }
  }
  
  /**
   * Request the user's current geolocation
   */
  getCurrentLocation() {
    // Update UI to show we're fetching location
    if (this.locationText) {
      this.locationText.innerHTML = 'Fetching your location...';
      this.locationText.classList.add('loading');
    }
    
    // Request geolocation from browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleLocationSuccess,
        this.handleLocationError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      this.handleLocationError({ code: 0, message: 'Geolocation not supported by this browser' });
    }
  }
  
  /**
   * Handle successful geolocation
   */
  handleLocationSuccess(position) {
    // Extract coordinates and accuracy
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    
    // Store coordinates for later use
    this.locationCoords = { lat, lng };
    
    // Clear existing markers if they exist
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    if (this.circle) {
      this.map.removeLayer(this.circle);
    }
    
    // Add new markers
    this.marker = L.marker([lat, lng]).addTo(this.map)
      .bindPopup('Your current location')
      .openPopup();
      
    this.circle = L.circle([lat, lng], {
      radius: accuracy,
      color: '#3a86ff',
      fillColor: '#3a86ff',
      fillOpacity: 0.15
    }).addTo(this.map);
    
    // Zoom to fit the accuracy circle
    if (!this.zoomed) {
      this.map.fitBounds(this.circle.getBounds());
      this.zoomed = true;
    } else {
      this.map.setView([lat, lng], this.map.getZoom());
    }
    
    // Update location text display
    this.updateLocationDisplay(lat, lng);
    
    // Trigger a custom event that other components can listen for
    document.dispatchEvent(new CustomEvent('locationUpdated', {
      detail: { lat, lng, accuracy }
    }));
  }
  
  /**
   * Handle geolocation errors
   */
  handleLocationError(error) {
    // Update UI with error information
    if (this.locationText) {
      this.locationText.classList.remove('loading');
      
      switch(error.code) {
        case 1: // Permission denied
          this.locationText.innerHTML = '<i class="fas fa-exclamation-triangle text-amber-500 mr-2"></i> Location access denied. Please enable location services.';
          break;
        case 2: // Position unavailable
          this.locationText.innerHTML = '<i class="fas fa-exclamation-triangle text-amber-500 mr-2"></i> Unable to determine your location.';
          break;
        case 3: // Timeout
          this.locationText.innerHTML = '<i class="fas fa-exclamation-triangle text-amber-500 mr-2"></i> Location request timed out.';
          break;
        default:
          this.locationText.innerHTML = '<i class="fas fa-exclamation-triangle text-amber-500 mr-2"></i> Location error: ' + error.message;
      }
    }
    
    // If map is initialized, show a default location (Dhaka, Bangladesh)
    if (this.map) {
      this.map.setView([23.8103, 90.4125], 13);
    }
  }
  
  /**
   * Update the location text display with reverse-geocoded address
   */
  updateLocationDisplay(lat, lng) {
    if (!this.locationText) return;
    
    // Use Nominatim for reverse geocoding (address lookup)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      .then(response => response.json())
      .then(data => {
        const address = data.display_name;
        this.locationText.innerHTML = `<i class="fas fa-map-marker-alt text-red-500 mr-2"></i> ${address}`;
        this.locationText.classList.remove('loading');
      })
      .catch(error => {
        console.error('Error in reverse geocoding:', error);
        // Fallback to coordinates if geocoding fails
        this.locationText.innerHTML = `<i class="fas fa-map-marker-alt text-red-500 mr-2"></i> Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`;
        this.locationText.classList.remove('loading');
      });
  }
  
  /**
   * Get hospitals near the current location
   */
  getHospitalsNearby() {
    if (!this.locationCoords) {
      alert('Your location is not available. Please allow location access and try again.');
      return;
    }
    
    const { lat, lng } = this.locationCoords;
    window.open(`https://www.google.com/maps/search/hospitals/@${lat},${lng},14z`, '_blank');
  }
  
  /**
   * Get directions to a specific hospital
   */
  getDirectionsToHospital(hospitalAddress) {
    if (!this.locationCoords) {
      alert('Your location is not available. Please allow location access and try again.');
      return;
    }
    
    const { lat, lng } = this.locationCoords;
    window.open(`https://www.google.com/maps/dir/${lat},${lng}/${hospitalAddress}`, '_blank');
  }
}

// Initialize on DOM content loaded if not being used as a module
if (typeof module === 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the emergency page with map element
    const mapElement = document.getElementById('map');
    if (mapElement && mapElement.tagName === 'DIV') {
      const locationMap = new LocationMapManager('map', 'location-name', 'refresh-location');
      locationMap.initMap();
      
      // Set up hospital direction buttons
      document.querySelectorAll('.hospital-directions').forEach(button => {
        button.addEventListener('click', function() {
          locationMap.getDirectionsToHospital(this.getAttribute('data-hospital-address'));
        });
      });
    }
  });
}

// Export for module usage
if (typeof module !== 'undefined') {
  module.exports = LocationMapManager;
} 