// Emergency Alert System for Zentorra Medicare
const EmergencyAlert = (function() {
    // Track if the alert is currently shown
    let isAlertVisible = false;
    
    // Create the alert element
    function createAlertElement() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'emergency-alert-overlay';
        
        // Create alert container
        const alert = document.createElement('div');
        alert.className = 'emergency-alert';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'emergency-alert-header';
        
        const title = document.createElement('h3');
        title.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Medical Emergency Alert';
        
        header.appendChild(title);
        
        // Create body
        const body = document.createElement('div');
        body.className = 'emergency-alert-body';
        
        const message = document.createElement('p');
        message.textContent = 'It appears you may be describing a medical emergency. If you or someone else is experiencing a life-threatening situation, please call emergency services immediately.';
        
        const disclaimer = document.createElement('p');
        disclaimer.textContent = 'Do not wait for a response from this chat. Medical emergencies require immediate professional attention.';
        disclaimer.style.fontWeight = '500';
        
        body.appendChild(message);
        body.appendChild(disclaimer);
        
        // Create actions
        const actions = document.createElement('div');
        actions.className = 'emergency-alert-actions';
        
        const callButton = document.createElement('button');
        callButton.className = 'btn-emergency-call';
        callButton.innerHTML = '<i class="fas fa-phone"></i> Call 999';
        callButton.onclick = () => {
            window.location.href = 'tel:999';
        };
        
        const dismissButton = document.createElement('button');
        dismissButton.className = 'btn-dismiss';
        dismissButton.textContent = 'I understand, dismiss this alert';
        dismissButton.onclick = () => {
            hideAlert();
        };
        
        actions.appendChild(callButton);
        actions.appendChild(dismissButton);
        
        // Assemble the alert
        body.appendChild(actions);
        alert.appendChild(header);
        alert.appendChild(body);
        overlay.appendChild(alert);
        
        return overlay;
    }
    
    // Show the emergency alert
    function showAlert() {
        if (isAlertVisible) return;
        
        isAlertVisible = true;
        const alertElement = createAlertElement();
        document.body.appendChild(alertElement);
        
        // Prevent scrolling of background content
        document.body.style.overflow = 'hidden';
    }
    
    // Hide the emergency alert
    function hideAlert() {
        if (!isAlertVisible) return;
        
        const overlay = document.querySelector('.emergency-alert-overlay');
        if (overlay) {
            overlay.addEventListener('animationend', () => {
                document.body.removeChild(overlay);
            });
            
            overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
            isAlertVisible = false;
            
            // Re-enable scrolling
            document.body.style.overflow = '';
        }
    }
    
    // Public methods
    return {
        show: showAlert,
        hide: hideAlert,
        isVisible: () => isAlertVisible
    };
})();

// Export the module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmergencyAlert;
} 