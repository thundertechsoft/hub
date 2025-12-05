/**
 * SHIRT HUB - ADMIN PANEL JAVASCRIPT
 * Complete Admin Dashboard Management System
 */

// ============ GLOBAL VARIABLES ============
let products = [];
let orders = [];
let customers = [];
let currentUser = null;

// ============ MAIN INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Admin Panel Loaded');
    
    // Check authentication
    if (!checkAdminAuth()) {
        return;
    }
    
    // Initialize admin panel
    initializeAdminPanel();
    
    // Load all data
    loadAllData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup real-time updates
    setupRealTimeUpdates();
});

/**
 * Check Admin Authentication
 */
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (!isLoggedIn || !loginTime) {
        redirectToLogin('Please login to access admin panel');
        return false;
    }
    
    // Check session expiry (8 hours)
    const loginDate = new Date(loginTime);
    const currentDate = new Date();
    const hoursDiff = Math.abs(currentDate - loginDate) / 36e5;
    
    if (hoursDiff >= 8) {
        redirectToLogin('Session expired. Please login again');
        return false;
    }
    
    // Get current user
    currentUser = {
        username: localStorage.getItem('adminUser') || 'Admin',
        role: localStorage.getItem('adminRole') || 'admin'
    };
    
    // Update UI with user info
    updateUserInfo();
    
    // Check permissions based on role
    checkPermissions();
    
    return true;
}

/**
 * Initialize Admin Panel
 */
function initializeAdminPanel() {
    // Update page title with username
    document.title = `Admin Panel | ${currentUser.username} | Shirt Hub`;
    
    // Setup sidebar menu
    setupSidebarMenu();
    
    // Setup dashboard widgets
    setupDashboardWidgets();
    
    // Setup product management
    setupProductManagement();
    
    // Setup order management
    setupOrderManagement();
    
    // Setup customer management
    setupCustomerManagement();
    
    // Setup analytics
    setupAnalytics();
    
    // Setup settings
    setupSettings();
    
    // Show welcome notification
    showNotification(`Welcome back, ${currentUser.username}!`, 'success');
}

/**
 * Load All Data
 */
function loadAllData() {
    // Load products from localStorage or API
    loadProducts();
    
    // Load orders
    loadOrders();
    
    // Load customers
    loadCustomers();
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Update recent activities
    updateRecentActivities();
}

// ============ PRODUCT MANAGEMENT ============
function setupProductManagement() {
    // Load products table
    loadProductsTable();
    
    // Setup add product form
    setupAddProductForm();
    
    // Setup edit product modal
    setupEditProductModal();
    
    // Setup bulk actions
    setupBulkActions();
    
    // Setup search and filters
    setupProductFilters();
}

function loadProducts() {
    // Try to load from localStorage first
    const savedProducts = localStorage.getItem('shirtHubProducts');
    
    if (savedProducts) {
        products = JSON.parse(savedProducts);
        console.log(`✅ Loaded ${products.length} products from storage`);
    } else {
        // Default products
        products = [
            {
                id: 1,
                name: "Premium Formal Shirt - Blue",
                category: "formal",
                price: 1299,
                originalPrice: 1999,
                discount: 35,
                rating: 4.8,
                reviews: 125,
                description: "100% Cotton formal shirt with perfect fit for office wear",
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['Blue', 'White', 'Black'],
                stock: 50,
                status: 'active',
                images: ['shirt1-front.jpg', 'shirt1-back.jpg'],
                createdAt: '2024-01-15',
                updatedAt: '2024-01-20'
            },
            {
                id: 2,
                name: "Casual Check Shirt - Red",
                category: "casual",
                price: 999,
                originalPrice: 1499,
                discount: 33,
                rating: 4.5,
                reviews: 89,
                description: "Comfortable casual shirt for daily wear",
                sizes: ['M', 'L', 'XL'],
                colors: ['Red', 'Blue'],
                stock: 30,
                status: 'active',
                images: ['shirt2-front.jpg', 'shirt2-back.jpg'],
                createdAt: '2024-01-18',
                updatedAt: '2024-01-25'
            }
        ];
        saveProducts();
    }
}

function saveProducts() {
    localStorage.setItem('shirtHubProducts', JSON.stringify(products));
    console.log(`💾 Saved ${products.length} products to storage`);
}

function loadProductsTable() {
    const tableBody = document.getElementById('productsList');
    if (!tableBody) return;
    
    tableBody.innerHTML = products.map(product => `
        <tr data-id="${product.id}">
            <td>
                <input type="checkbox" class="product-checkbox" data-id="${product.id}">
            </td>
            <td>#${String(product.id).padStart(3, '0')}</td>
            <td>
                <div class="product-info-cell">
                    <div class="product-thumb"></div>
                    <div>
                        <strong>${product.name}</strong>
                        <div class="product-meta">
                            <span class="category-badge ${product.category}">${product.category}</span>
                            <span class="stock-info ${product.stock < 10 ? 'low-stock' : ''}">
                                <i class="fas fa-box"></i> ${product.stock} in stock
                            </span>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <span class="price">₹${product.price.toLocaleString('en-IN')}</span>
                ${product.originalPrice > product.price ? 
                    `<div class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</div>` : ''}
            </td>
            <td>
                <span class="stock-badge ${product.stock > 20 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-stock'}">
                    ${product.stock > 20 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <span class="status-badge ${product.status}">${product.status}</span>
            </td>
            <td class="actions">
                <button class="btn-action btn-view" onclick="viewProduct(${product.id})" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action btn-edit" onclick="editProduct(${product.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteProduct(${product.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function setupAddProductForm() {
    const form = document.getElementById('productForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const productData = {
            id: generateProductId(),
            name: formData.get('name') || '',
            category: formData.get('category') || 'formal',
            price: parseInt(formData.get('price')) || 0,
            originalPrice: parseInt(formData.get('originalPrice')) || 0,
            discount: formData.get('discount') ? parseInt(formData.get('discount')) : 0,
            description: formData.get('description') || '',
            stock: parseInt(formData.get('stock')) || 0,
            sizes: Array.from(form.querySelectorAll('input[name="sizes"]:checked')).map(cb => cb.value),
            colors: formData.get('colors') ? formData.get('colors').split(',') : [],
            status: 'active',
            images: [],
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        
        // Validate
        if (!productData.name || productData.price <= 0) {
            showNotification('Please fill all required fields correctly', 'error');
            return;
        }
        
        // Add product
        products.unshift(productData);
        saveProducts();
        
        // Update table
        loadProductsTable();
        
        // Reset form
        form.reset();
        
        // Show success
        showNotification(`Product "${productData.name}" added successfully!`, 'success');
        
        // Update stats
        updateDashboardStats();
        
        // Log activity
        logActivity(`Added new product: ${productData.name}`, 'product');
    });
}

function generateProductId() {
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    return maxId + 1;
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Create edit modal
    showEditModal(product);
}

function showEditModal(product) {
    // Remove existing modal
    const existingModal = document.querySelector('.edit-modal');
    if (existingModal) existingModal.remove();
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-edit"></i> Edit Product</h3>
                <button class="modal-close" onclick="closeEditModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="editProductForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Product Name *</label>
                            <input type="text" name="name" value="${product.name}" required>
                        </div>
                        <div class="form-group">
                            <label>Category *</label>
                            <select name="category" required>
                                <option value="formal" ${product.category === 'formal' ? 'selected' : ''}>Formal</option>
                                <option value="casual" ${product.category === 'casual' ? 'selected' : ''}>Casual</option>
                                <option value="designer" ${product.category === 'designer' ? 'selected' : ''}>Designer</option>
                                <option value="cotton" ${product.category === 'cotton' ? 'selected' : ''}>Cotton</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Price (₹) *</label>
                            <input type="number" name="price" value="${product.price}" required>
                        </div>
                        <div class="form-group">
                            <label>Original Price (₹)</label>
                            <input type="number" name="originalPrice" value="${product.originalPrice}">
                        </div>
                        <div class="form-group">
                            <label>Stock *</label>
                            <input type="number" name="stock" value="${product.stock}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Description *</label>
                        <textarea name="description" rows="3" required>${product.description}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Sizes Available</label>
                        <div class="size-checkboxes">
                            <label><input type="checkbox" name="sizes" value="S" ${product.sizes.includes('S') ? 'checked' : ''}> S</label>
                            <label><input type="checkbox" name="sizes" value="M" ${product.sizes.includes('M') ? 'checked' : ''}> M</label>
                            <label><input type="checkbox" name="sizes" value="L" ${product.sizes.includes('L') ? 'checked' : ''}> L</label>
                            <label><input type="checkbox" name="sizes" value="XL" ${product.sizes.includes('XL') ? 'checked' : ''}> XL</label>
                            <label><input type="checkbox" name="sizes" value="XXL" ${product.sizes.includes('XXL') ? 'checked' : ''}> XXL</label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Colors (comma separated)</label>
                        <input type="text" name="colors" value="${product.colors.join(', ')}">
                    </div>
                    
                    <div class="form-group">
                        <label>Status</label>
                        <select name="status">
                            <option value="active" ${product.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${product.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                            <option value="draft" ${product.status === 'draft' ? 'selected' : ''}>Draft</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-save">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                        <button type="button" class="btn-cancel" onclick="closeEditModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        border-radius: 15px;
        animation: slideUp 0.5s ease;
    `;
    
    // Handle form submission
    const editForm = document.getElementById('editProductForm');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateProduct(product.id, new FormData(this));
    });
}

function updateProduct(productId, formData) {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;
    
    const updatedProduct = {
        ...products[productIndex],
        name: formData.get('name') || products[productIndex].name,
        category: formData.get('category') || products[productIndex].category,
        price: parseInt(formData.get('price')) || products[productIndex].price,
        originalPrice: parseInt(formData.get('originalPrice')) || products[productIndex].originalPrice,
        stock: parseInt(formData.get('stock')) || products[productIndex].stock,
        description: formData.get('description') || products[productIndex].description,
        status: formData.get('status') || products[productIndex].status,
        sizes: Array.from(document.querySelectorAll('input[name="sizes"]:checked')).map(cb => cb.value),
        colors: formData.get('colors') ? formData.get('colors').split(',').map(c => c.trim()) : products[productIndex].colors,
        updatedAt: new Date().toISOString().split('T')[0]
    };
    
    // Calculate discount
    if (updatedProduct.originalPrice > updatedProduct.price) {
        updatedProduct.discount = Math.round((1 - updatedProduct.price / updatedProduct.originalPrice) * 100);
    }
    
    // Update product
    products[productIndex] = updatedProduct;
    saveProducts();
    
    // Update table
    loadProductsTable();
    
    // Close modal
    closeEditModal();
    
    // Show success
    showNotification(`Product "${updatedProduct.name}" updated successfully!`, 'success');
    
    // Log activity
    logActivity(`Updated product: ${updatedProduct.name}`, 'product');
}

function closeEditModal() {
    const modal = document.querySelector('.edit-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Remove product
    products = products.filter(p => p.id !== productId);
    saveProducts();
    
    // Update table
    loadProductsTable();
    
    // Show success
    showNotification(`Product "${product.name}" deleted successfully!`, 'success');
    
    // Update stats
    updateDashboardStats();
    
    // Log activity
    logActivity(`Deleted product: ${product.name}`, 'product');
}

function viewProduct(productId) {
    // In real app, this would show detailed view
    const product = products.find(p => p.id === productId);
    if (product) {
        showNotification(`Viewing: ${product.name}`, 'info');
    }
}

// ============ ORDER MANAGEMENT ============
function setupOrderManagement() {
    // Load orders
    loadOrders();
    
    // Setup order table
    loadOrdersTable();
    
    // Setup order actions
    setupOrderActions();
}

function loadOrders() {
    // Load from localStorage or API
    const savedOrders = localStorage.getItem('shirtHubOrders');
    orders = savedOrders ? JSON.parse(savedOrders) : [];
}

function loadOrdersTable() {
    // Similar to products table
    console.log('Loading orders table...');
}

// ============ CUSTOMER MANAGEMENT ============
function setupCustomerManagement() {
    // Load customers
    loadCustomers();
    
    // Setup customer table
    loadCustomersTable();
}

function loadCustomers() {
    // Load from localStorage or API
    const savedCustomers = localStorage.getItem('shirtHubCustomers');
    customers = savedCustomers ? JSON.parse(savedCustomers) : [];
}

// ============ DASHBOARD FUNCTIONS ============
function setupDashboardWidgets() {
    // Update all widgets
    updateDashboardStats();
    
    // Setup refresh button
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('refreshing');
            setTimeout(() => {
                updateDashboardStats();
                this.classList.remove('refreshing');
                showNotification('Dashboard refreshed!', 'success');
            }, 1000);
        });
    }
}

function updateDashboardStats() {
    // Calculate stats
    const totalProducts = products.length;
    const totalRevenue = calculateTotalRevenue();
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    
    // Update DOM
    updateStatCard('total-products', totalProducts);
    updateStatCard('total-orders', totalOrders);
    updateStatCard('total-revenue', totalRevenue, '₹');
    updateStatCard('total-customers', totalCustomers);
    
    // Update charts
    updateSalesChart();
    updateCategoryChart();
}

function calculateTotalRevenue() {
    return orders.reduce((total, order) => total + order.total, 0);
}

function updateStatCard(className, value, prefix = '') {
    const element = document.querySelector(`.${className} .stat-number`);
    if (element) {
        // Animate number change
        animateValue(element, 0, value, 1000, prefix);
    }
}

function animateValue(element, start, end, duration, prefix = '') {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = prefix + current.toLocaleString('en-IN');
        
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// ============ ANALYTICS ============
function setupAnalytics() {
    // Initialize charts
    initSalesChart();
    initCategoryChart();
    initRevenueChart();
}

function initSalesChart() {
    // Chart.js or custom chart implementation
    console.log('Initializing sales chart...');
}

// ============ SETTINGS ============
function setupSettings() {
    // Load settings
    loadSettings();
    
    // Setup save settings
    setupSaveSettings();
    
    // Setup backup/restore
    setupBackupRestore();
}

function loadSettings() {
    const settings = localStorage.getItem('adminSettings') || '{}';
    // Apply settings
    console.log('Settings loaded:', settings);
}

// ============ EVENT LISTENERS ============
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutAdmin);
    }
    
    // Sidebar menu
    const menuItems = document.querySelectorAll('.admin-menu a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class
            menuItems.forEach(i => i.parentElement.classList.remove('active'));
            
            // Add active to clicked
            this.parentElement.classList.add('active');
            
            // Show corresponding section
            const target = this.getAttribute('href').substring(1);
            showSection(target);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchProducts(this.value);
        });
    }
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-main > section');
    sections.forEach(section => section.style.display = 'none');
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

// ============ UTILITY FUNCTIONS ============
function setupSidebarMenu() {
    // Add active class to current page
    const currentPage = window.location.hash.substring(1) || 'dashboard';
    const currentMenuItem = document.querySelector(`.admin-menu a[href="#${currentPage}"]`);
    if (currentMenuItem) {
        currentMenuItem.parentElement.classList.add('active');
        showSection(currentPage);
    }
}

function updateUserInfo() {
    const userElement = document.querySelector('.admin-user span');
    if (userElement) {
        userElement.textContent = currentUser.username;
    }
}

function checkPermissions() {
    const role = currentUser.role;
    
    // Hide/show elements based on role
    if (role === 'editor') {
        // Editors can only edit, not delete
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.style.display = 'none';
        });
    }
    
    if (role === 'manager') {
        // Managers have full access except settings
        const settingsLink = document.querySelector('a[href="#settings"]');
        if (settingsLink) {
            settingsLink.parentElement.style.display = 'none';
        }
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            showNotification('Manual save triggered', 'info');
        }
        
        // Ctrl + L to logout
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            logoutAdmin();
        }
        
        // Ctrl + F to focus search
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
}

function setupRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        updateDashboardStats();
        updateRecentActivities();
    }, 30000);
}

function updateRecentActivities() {
    const activities = [
        { action: 'New order received', time: '2 minutes ago', type: 'order' },
        { action: 'Product stock updated', time: '5 minutes ago', type: 'product' },
        { action: 'Customer registered', time: '10 minutes ago', type: 'customer' }
    ];
    
    const container = document.querySelector('.recent-activities');
    if (container) {
        container.innerHTML = activities.map(activity => `
            <div class="activity-item ${activity.type}">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
                <div>
                    <p>${activity.action}</p>
                    <small>${activity.time}</small>
                </div>
            </div>
        `).join('');
    }
}

function getActivityIcon(type) {
    switch(type) {
        case 'order': return 'shopping-cart';
        case 'product': return 'tshirt';
        case 'customer': return 'user';
        default: return 'bell';
    }
}

function logActivity(action, type) {
    const activity = {
        action,
        type,
        user: currentUser.username,
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleTimeString()
    };
    
    // Save to localStorage
    const activities = JSON.parse(localStorage.getItem('adminActivities') || '[]');
    activities.unshift(activity);
    
    // Keep only last 50 activities
    if (activities.length > 50) {
        activities.pop();
    }
    
    localStorage.setItem('adminActivities', JSON.stringify(activities));
}

// ============ NOTIFICATION SYSTEM ============
function showNotification(message, type = 'info') {
    // Create notification
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Add animations
    if (!document.querySelector('#notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'bell';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#00c9a7';
        case 'error': return '#ff6b6b';
        case 'warning': return '#ffa726';
        case 'info': return '#4a6bff';
        default: return '#6c757d';
    }
}

// ============ LOGOUT FUNCTION ============
function logoutAdmin() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminLoginTime');
        localStorage.removeItem('adminRole');
        
        // Show logout message
        showNotification('Logged out successfully. Redirecting...', 'info');
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'admin-login.html';
        }, 1500);
    }
}

// ============ REDIRECT TO LOGIN ============
function redirectToLogin(message = 'Please login') {
    // Store message to show on login page
    sessionStorage.setItem('loginMessage', message);
    
    // Redirect
    window.location.href = 'admin-login.html';
}

// ============ MAKE FUNCTIONS GLOBAL ============
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewProduct = viewProduct;
window.closeEditModal = closeEditModal;
window.logoutAdmin = logoutAdmin;
