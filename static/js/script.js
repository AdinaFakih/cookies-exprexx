document.addEventListener('DOMContentLoaded', function() {
    const deliveryForm = document.getElementById('deliveryForm');
    const addressInput = document.getElementById('address');
    const landmarkInput = document.getElementById('landmark');
    const instructionsInput = document.getElementById('instructions');
    const deleteButton = document.getElementById('deleteInfo');
    
    // Function to load saved data from localStorage
    function loadSavedData() {
        const savedAddress = localStorage.getItem('cookies_express_address');
        const savedLandmark = localStorage.getItem('cookies_express_landmark');
        const savedInstructions = localStorage.getItem('cookies_express_instructions');
        
        if (savedAddress) addressInput.value = savedAddress;
        if (savedLandmark) landmarkInput.value = savedLandmark;
        if (savedInstructions) instructionsInput.value = savedInstructions;
    }
    
    // Load saved data when page loads
    loadSavedData();
    
    // Save form data to localStorage on form submission
    deliveryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Save data to localStorage
        localStorage.setItem('cookies_express_address', addressInput.value);
        localStorage.setItem('cookies_express_landmark', landmarkInput.value);
        localStorage.setItem('cookies_express_instructions', instructionsInput.value);
        
        // Show confirmation
        showNotification('Your information has been updated!');
    });
    
    // Delete saved information
    deleteButton.addEventListener('click', function() {
        // Clear localStorage
        localStorage.removeItem('cookies_express_address');
        localStorage.removeItem('cookies_express_landmark');
        localStorage.removeItem('cookies_express_instructions');
        
        // Clear form fields
        addressInput.value = '';
        landmarkInput.value = '';
        instructionsInput.value = '';
        
        // Show confirmation
        showNotification('Your information has been deleted!');
    });
    
    // Function to show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--gold-accent)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1000';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        document.body.appendChild(notification);
        
        // Animation for showing
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add animation effects for form inputs
    const formInputs = document.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateX(5px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateX(0)';
        });
    });
});
