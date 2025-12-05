/**
 * SHIRT HUB - ADMIN LOGIN JAVASCRIPT
 * Secure Admin Authentication System
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Admin Login Page Loaded');
    
    // Get the login form
    const loginForm = document.getElementById('adminLoginForm');
    
    if (!loginForm) {
        console.error('❌ Login form not found!');
        return;
    }
    
    // Focus on username field on page load
    document.getElementById('username').focus();
    
    // Handle form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting normally
        
        // Get input values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Validate inputs
        if (!username || !password) {
            showLoginError('Please enter both username and password');
            return;
        }
        
        // Show loading state
        showLoading(true);
        
        // Simulate API call delay
        setTimeout(() => {
            // Check credentials (In real app, this would be server-side)
            if (authenticateAdmin(username, password)) {
                // Successful login
                showLoginSuccess();
                
                // Store login session (In real app, use secure tokens)
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUser', username);
                localStorage.setItem('adminLoginTime', new Date().toISOString());
                
                // Redirect to admin panel after delay
                setTimeout(() => {
                    window.location.href = 'admin-panel.html';
                }, 1500);
            } else {
                // Failed login
                showLoginError('Invalid username or password');
                showLoading(false);
                
                // Clear password field
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
                
                // Add shake animation to form
                loginForm.classList.add('shake');
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 500);
            }
        }, 1000); // Simulate 1 second API delay
    });
    
    // Add enter key support
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Add show/hide password toggle
    const passwordField = document.getElementById('password');
    const showPasswordBtn = document.createElement('button');
    showPasswordBtn.type = 'button';
    showPasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
    showPasswordBtn.className = 'show-password-btn';
    showPasswordBtn.title = 'Show/Hide Password';
    
    // Insert after password field
    passwordField.parentNode.appendChild(showPasswordBtn);
    
    showPasswordBtn.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        
        // Change icon
        this.innerHTML = type === 'password' ? 
            '<i class="fas fa-eye"></i>' : 
            '<i class="fas fa-eye-slash"></i>';
    });
    
    // Add styles for show password button
    const style = document.createElement('style');
    style.textContent = `
        .show-password-btn {
            position: absolute;
            right: 15px;
            top: 38px;
            background: transparent;
            border: none;
            color: var(--gray-color);
            cursor: pointer;
            padding: 5px;
        }
        
        .show-password-btn:hover {
            color: var(--primary-color);
        }
        
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});

/**
 * Admin Authentication Function
 * In real application, this would be server-side
 */
function authenticateAdmin(username, password) {
    // Predefined admin credentials (In production, use database)
    const adminCredentials = [
        { username: 'admin', password: 'Admin@2024', role: 'superadmin' },
        { username: 'manager', password: 'Manager@123', role: 'manager' },
        { username: 'editor', password: 'Editor@456', role: 'editor' }
    ];
    
    // Check if credentials match
    const validUser = adminCredentials.find(
        cred => cred.username === username && cred.password === password
    );
    
    if (validUser) {
        // Store user role for authorization
        localStorage.setItem('adminRole', validUser.role);
        console.log(`✅ Login successful as ${validUser.role}`);
        return true;
    }
    
    // Failed attempts tracking (basic)
    let failedAttempts = parseInt(localStorage.getItem('failedAttempts') || '0');
    failedAttempts++;
    localStorage.setItem('failedAttempts', failedAttempts.toString());
    
    // Lock account after 5 failed attempts (for demo)
    if (failedAttempts >= 5) {
        showLoginError('Account locked. Try again after 5 minutes.');
        setTimeout(() => {
            localStorage.setItem('failedAttempts', '0');
        }, 300000); // 5 minutes
        return false;
    }
    
    return false;
}

/**
 * Show Loading State
 */
function showLoading(isLoading) {
    const submitBtn = document.querySelector('.btn-login');
    if (!submitBtn) return;
    
    if (isLoading) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
    } else {
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

/**
 * Show Login Success Message
 */
function showLoginSuccess() {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'login-success';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Login Successful!</h3>
            <p>Redirecting to Admin Panel...</p>
        </div>
    `;
    
    // Add styles
    successDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 201, 167, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        text-align: center;
        animation: fadeIn 0.5s ease;
    `;
    
    const successContent = successDiv.querySelector('.success-content');
    successContent.style.cssText = `
        animation: bounceIn 1s ease;
    `;
    
    successContent.querySelector('i').style.cssText = `
        font-size: 4rem;
        margin-bottom: 20px;
        color: white;
    `;
    
    successContent.querySelector('h3').style.cssText = `
        font-size: 2.5rem;
        margin-bottom: 10px;
    `;
    
    successContent.querySelector('p').style.cssText = `
        font-size: 1.2rem;
        opacity: 0.9;
    `;
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes bounceIn {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(successDiv);
}

/**
 * Show Login Error Message
 */
function showLoginError(message) {
    // Remove any existing error message
    const existingError = document.querySelector('.login-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    errorDiv.style.cssText = `
        background: #ff6b6b;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        margin-top: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideDown 0.3s ease;
    `;
    
    errorDiv.querySelector('i').style.cssText = `
        font-size: 1.2rem;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Insert after form
    const form = document.getElementById('adminLoginForm');
    form.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }, 5000);
}

/**
 * Check if already logged in (if user visits login page while logged in)
 */
function checkExistingSession() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (isLoggedIn && loginTime) {
        const loginDate = new Date(loginTime);
        const currentDate = new Date();
        const hoursDiff = Math.abs(currentDate - loginDate) / 36e5;
        
        // Auto logout after 8 hours (for security)
        if (hoursDiff < 8) {
            window.location.href = 'admin-panel.html';
        } else {
            // Session expired
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminLoginTime');
            localStorage.removeItem('adminRole');
        }
    }
}

// Check session on page load
checkExistingSession();

// Prevent back button after logout
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        checkExistingSession();
    }
});
