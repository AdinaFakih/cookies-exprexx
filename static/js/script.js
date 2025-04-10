document.addEventListener('DOMContentLoaded', function() {
    const deliveryForm = document.getElementById('deliveryForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const landmarkInput = document.getElementById('landmark');
    const instructionsInput = document.getElementById('instructions');
    const deleteButton = document.getElementById('deleteInfo');
    const savedDataDisplay = document.getElementById('savedDataDisplay');
    
    // Function to load saved data from localStorage
    function loadSavedData() {
        const savedName = localStorage.getItem('cookies_express_name');
        const savedEmail = localStorage.getItem('cookies_express_email');
        const savedPhone = localStorage.getItem('cookies_express_phone');
        const savedAddress = localStorage.getItem('cookies_express_address');
        const savedLandmark = localStorage.getItem('cookies_express_landmark');
        const savedInstructions = localStorage.getItem('cookies_express_instructions');
        
        if (savedName) nameInput.value = savedName;
        if (savedEmail) emailInput.value = savedEmail;
        if (savedPhone) phoneInput.value = savedPhone;
        if (savedAddress) addressInput.value = savedAddress;
        if (savedLandmark) landmarkInput.value = savedLandmark;
        if (savedInstructions) instructionsInput.value = savedInstructions;
    }
    
    // Function to load all data from the database
    function loadAllCustomers() {
        fetch('/api/customers')
            .then(response => response.json())
            .then(customers => {
                displayCustomers(customers);
            })
            .catch(error => {
                console.error('Error fetching customers:', error);
                showNotification('Failed to load saved data.', 'error');
            });
    }
    
    // Function to display all customers
    function displayCustomers(customers) {
        savedDataDisplay.innerHTML = '';
        
        if (customers.length === 0) {
            savedDataDisplay.innerHTML = '<div class="empty-data-message">No saved information found</div>';
            return;
        }
        
        customers.forEach(customer => {
            const createdDate = new Date(customer.created_at);
            const formattedDate = createdDate.toLocaleDateString() + ' ' + createdDate.toLocaleTimeString();
            
            const entryDiv = document.createElement('div');
            entryDiv.className = 'data-entry';
            entryDiv.innerHTML = `
                <h4>${customer.name}</h4>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Phone:</strong> ${customer.phone}</p>
                <p><strong>Address:</strong> ${customer.address}</p>
                <p><strong>Landmark:</strong> ${customer.landmark}</p>
                <p><strong>Instructions:</strong> ${customer.instructions || 'None'}</p>
                <p><strong>Saved on:</strong> ${formattedDate}</p>
                <button class="delete-entry" data-id="${customer.id}">Delete</button>
            `;
            
            savedDataDisplay.appendChild(entryDiv);
        });
        
        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-entry').forEach(button => {
            button.addEventListener('click', function() {
                const customerId = this.getAttribute('data-id');
                deleteCustomer(customerId);
            });
        });
    }
    
    // Function to delete a customer
    function deleteCustomer(id) {
        fetch(`/api/customers/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    loadAllCustomers();
                    showNotification('Customer information deleted successfully!');
                } else {
                    throw new Error('Failed to delete customer');
                }
            })
            .catch(error => {
                console.error('Error deleting customer:', error);
                showNotification('Failed to delete information.', 'error');
            });
    }
    
    // Load saved data when page loads
    loadSavedData();
    
    // Load all customers from database
    loadAllCustomers();
    
    // Save form data to localStorage and database on form submission
    deliveryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Save data to localStorage
        localStorage.setItem('cookies_express_name', nameInput.value);
        localStorage.setItem('cookies_express_email', emailInput.value);
        localStorage.setItem('cookies_express_phone', phoneInput.value);
        localStorage.setItem('cookies_express_address', addressInput.value);
        localStorage.setItem('cookies_express_landmark', landmarkInput.value);
        localStorage.setItem('cookies_express_instructions', instructionsInput.value);
        
        // Save data to database
        const customerData = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            address: addressInput.value,
            landmark: landmarkInput.value,
            instructions: instructionsInput.value
        };
        
        fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        })
            .then(response => response.json())
            .then(data => {
                showNotification('Your information has been saved!');
                loadAllCustomers();
            })
            .catch(error => {
                console.error('Error saving customer data:', error);
                showNotification('Failed to save to database, but saved locally.', 'warning');
            });
    });
    
    // Delete saved information
    deleteButton.addEventListener('click', function() {
        // Clear localStorage
        localStorage.removeItem('cookies_express_name');
        localStorage.removeItem('cookies_express_email');
        localStorage.removeItem('cookies_express_phone');
        localStorage.removeItem('cookies_express_address');
        localStorage.removeItem('cookies_express_landmark');
        localStorage.removeItem('cookies_express_instructions');
        
        // Clear form fields
        nameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
        addressInput.value = '';
        landmarkInput.value = '';
        instructionsInput.value = '';
        
        // Show confirmation
        showNotification('Your information has been deleted from this device!');
    });
    
    // Function to show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1000';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        // Set color based on notification type
        if (type === 'error') {
            notification.style.backgroundColor = 'var(--red)';
        } else if (type === 'warning') {
            notification.style.backgroundColor = '#ff9800';
        } else {
            notification.style.backgroundColor = 'var(--gold-accent)';
        }
        
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
