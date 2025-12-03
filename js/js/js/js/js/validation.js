// FORM VALIDATION SYSTEM

// Initialize form validation
function initFormValidation() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initContactForm(contactForm);
    }
    
    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        initCheckoutForm(checkoutForm);
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        initNewsletterForm(newsletterForm);
    }
    
    // Initialize all forms with validation
    initAllForms();
}

// Initialize all forms with validation
function initAllForms() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        // Add validation to required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', clearFieldError);
        });
        
        // Form submission
        form.addEventListener('submit', handleFormSubmit);
    });
}

// Validate single field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name || field.id;
    
    let isValid = true;
    let errorMessage = '';
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = getFieldLabel(field) + ' is required';
    }
    
    // Validate based on field type
    if (isValid && value) {
        switch (fieldType) {
            case 'email':
                if (!isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'tel':
                if (!isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
                
            case 'number':
                const min = field.getAttribute('min');
                const max = field.getAttribute('max');
                
                if (min && parseFloat(value) < parseFloat(min)) {
                    isValid = false;
                    errorMessage = `Minimum value is ${min}`;
                }
                
                if (max && parseFloat(value) > parseFloat(max)) {
                    isValid = false;
                    errorMessage = `Maximum value is ${max}`;
                }
                break;
                
            case 'text':
                if (fieldName.includes('name')) {
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters';
                    }
                }
                
                if (fieldName.includes('address')) {
                    if (value.length < 5) {
                        isValid = false;
                        errorMessage = 'Please enter a valid address';
                    }
                }
                
                if (fieldName.includes('city') || fieldName.includes('zip')) {
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Please enter a valid value';
                    }
                }
                break;
        }
    }
    
    // Update field state
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Get field label
function getFieldLabel(field) {
    const label = field.parentElement.querySelector('label');
    if (label) {
        return label.textContent.replace('*', '').trim();
    }
    
    const placeholder = field.getAttribute('placeholder');
    if (placeholder) {
        return placeholder;
    }
    
    return 'This field';
}

// Show field error
function showFieldError(field, message) {
    // Remove any existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Insert after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
    
    // Focus on field
    field.focus();
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    // Validate all fields
    const fields = form.querySelectorAll('[required]');
    let isValid = true;
    
    fields.forEach(field => {
        // Trigger validation for each field
        field.dispatchEvent(new Event('blur'));
        
        if (field.classList.contains('error')) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please correct the errors in the form', 'error');
        return;
    }
    
    // Form is valid, proceed with submission
    submitForm(form);
}

// Submit form (AJAX or regular)
function submitForm(form) {
    const formData = new FormData(form);
    const formAction = form.getAttribute('action');
    const formMethod = form.getAttribute('method') || 'POST';
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    // For demo purposes, we'll simulate API call
    setTimeout(() => {
        // Success
        submitButton.textContent = 'Success!';
        submitButton.classList.add('success');
        
        // Show success message
        showNotification('Form submitted successfully!', 'success');
        
        // Reset form after success
        setTimeout(() => {
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('success');
        }, 2000);
        
    }, 1500);
    
    // In production, you would use fetch API:
    /*
    fetch(formAction, {
        method: formMethod,
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle success
    })
    .catch(error => {
        // Handle error
    });
    */
}

// Contact form specific validation
function initContactForm(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };
        
        // Validate
        if (!validateContactForm(formData)) {
            return;
        }
        
        // Submit
        submitContactForm(formData);
    });
}

function validateContactForm(data) {
    // Name validation
    if (!data.name || data.name.length < 2) {
        showFieldError(document.getElementById('contactName'), 'Name must be at least 2 characters');
        return false;
    }
    
    // Email validation
    if (!data.email || !isValidEmail(data.email)) {
        showFieldError(document.getElementById('contactEmail'), 'Please enter a valid email address');
        return false;
    }
    
    // Subject validation
    if (!data.subject || data.subject.length < 3) {
        showFieldError(document.getElementById('contactSubject'), 'Subject must be at least 3 characters');
        return false;
    }
    
    // Message validation
    if (!data.message || data.message.length < 10) {
        showFieldError(document.getElementById('contactMessage'), 'Message must be at least 10 characters');
        return false;
    }
    
    return true;
}

function submitContactForm(data) {
    // In production, this would be an API call
    console.log('Contact form submitted:', data);
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    document.getElementById('contactForm').reset();
}

// Checkout form specific validation
function initCheckoutForm(form) {
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                zip: document.getElementById('zip').value,
                country: document.getElementById('country').value,
                payment: document.querySelector('input[name="payment"]:checked').value
            };
            
            // Validate
            if (!validateCheckoutForm(formData)) {
                return;
            }
            
            // Process checkout
            Cart.processCheckout(formData);
        });
    }
}

function validateCheckoutForm(data) {
    let isValid = true;
    
    // First name
    if (!data.firstName || data.firstName.length < 2) {
        showFieldError(document.getElementById('firstName'), 'First name must be at least 2 characters');
        isValid = false;
    }
    
    // Last name
    if (!data.lastName || data.lastName.length < 2) {
        showFieldError(document.getElementById('lastName'), 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    // Email
    if (!data.email || !isValidEmail(data.email)) {
        showFieldError(document.getElementById('email'), 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone
    if (!data.phone || !isValidPhone(data.phone)) {
        showFieldError(document.getElementById('phone'), 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Address
    if (!data.address || data.address.length < 5) {
        showFieldError(document.getElementById('address'), 'Please enter a valid address');
        isValid = false;
    }
    
    // City
    if (!data.city || data.city.length < 2) {
        showFieldError(document.getElementById('city'), 'Please enter a valid city');
        isValid = false;
    }
    
    // ZIP
    if (!data.zip || data.zip.length < 2) {
        showFieldError(document.getElementById('zip'), 'Please enter a valid ZIP code');
        isValid = false;
    }
    
    // Country
    if (!data.country) {
        showFieldError(document.getElementById('country'), 'Please select a country');
        isValid = false;
    }
    
    return isValid;
}

// Newsletter form
function initNewsletterForm(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletterEmail') || form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email || !isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Subscribe
        subscribeToNewsletter(email);
    });
}

function subscribeToNewsletter(email) {
    // Get existing subscriptions
    let subscriptions = JSON.parse(localStorage.getItem('shirthub_newsletter')) || [];
    
    // Check if already subscribed
    if (subscriptions.includes(email)) {
        showNotification('You\'re already subscribed!', 'info');
        return;
    }
    
    // Add to subscriptions
    subscriptions.push(email);
    localStorage.setItem('shirthub_newsletter', JSON.stringify(subscriptions));
    
    // Show success
    showNotification('Successfully subscribed to newsletter!', 'success');
    
    // Clear input
    const emailInput = document.getElementById('newsletterEmail') || document.querySelector('#newsletterForm input[type="email"]');
    if (emailInput) {
        emailInput.value = '';
    }
}

// Validation helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[^\d+]/g, ''));
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

function isValidCreditCard(cardNumber) {
    // Luhn algorithm for credit card validation
    let sum = 0;
    let shouldDouble = false;
    
    // Remove non-digits
    cardNumber = cardNumber.replace(/\D/g, '');
    
    // Loop through digits from right to left
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
}

function isValidExpiryDate(expiry) {
    // Format: MM/YY
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiry)) return false;
    
    const [month, year] = expiry.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    const expiryYear = parseInt(year);
    const expiryMonth = parseInt(month);
    
    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
    
    return true;
}

function isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

// Real-time validation
function initRealTimeValidation() {
    // Email validation on blur
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                showFieldError(this, 'Please enter a valid email address');
            }
        });
    });
    
    // Phone validation on blur
    const phoneFields = document.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value && !isValidPhone(this.value)) {
                showFieldError(this, 'Please enter a valid phone number');
            }
        });
    });
    
    // Password strength validation
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        field.addEventListener('input', function() {
            validatePasswordStrength(this);
        });
    });
}

function validatePasswordStrength(field) {
    const password = field.value;
    const strengthIndicator = field.parentNode.querySelector('.password-strength');
    
    if (!strengthIndicator) return;
    
    let strength = 0;
    let messages = [];
    
    // Length check
    if (password.length >= 8) strength++;
    else messages.push('At least 8 characters');
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength++;
    else messages.push('One lowercase letter');
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength++;
    else messages.push('One uppercase letter');
    
    // Number check
    if (/[0-9]/.test(password)) strength++;
    else messages.push('One number');
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else messages.push('One special character');
    
    // Update strength indicator
    const strengthClasses = ['very-weak', 'weak', 'fair', 'good', 'strong'];
    strengthIndicator.className = `password-strength ${strengthClasses[strength]}`;
    strengthIndicator.textContent = strengthClasses[strength].replace('-', ' ');
    
    // Show requirements if not met
    const requirements = field.parentNode.querySelector('.password-requirements');
    if (requirements) {
        if (strength < 4 && password.length > 0) {
            requirements.innerHTML = `Requirements: ${messages.join(', ')}`;
            requirements.style.display = 'block';
        } else {
            requirements.style.display = 'none';
        }
    }
}

// Form auto-save
function initFormAutoSave() {
    const forms = document.querySelectorAll('form[data-autosave]');
    
    forms.forEach(form => {
        const formId = form.id || 'form-' + Math.random().toString(36).substr(2, 9);
        const storageKey = 'form_autosave_' + formId;
        
        // Load saved data
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && !field.value) {
                    field.value = data[key];
                }
            });
        }
        
        // Save on input
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(() => {
                saveFormState(form, storageKey);
            }, 500));
        });
        
        // Clear on submit
        form.addEventListener('submit', () => {
            localStorage.removeItem(storageKey);
        });
    });
}

function saveFormState(form, storageKey) {
    const formData = {};
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (input.name) {
            formData[input.name] = input.value;
        }
    });
    
    localStorage.setItem(storageKey, JSON.stringify(formData));
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize validation
document.addEventListener('DOMContentLoaded', function() {
    initFormValidation();
    initRealTimeValidation();
    initFormAutoSave();
});

// Export validation functions
window.Validation = {
    init: initFormValidation,
    isValidEmail: isValidEmail,
    isValidPhone: isValidPhone,
    isValidCreditCard: isValidCreditCard,
    isValidExpiryDate: isValidExpiryDate,
    isValidCVV: isValidCVV,
    validateField: validateField,
    showFieldError: showFieldError,
    clearFieldError: clearFieldError
};
