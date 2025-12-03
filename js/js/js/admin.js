// ADMIN PANEL MANAGEMENT SYSTEM

// Admin credentials (In production, this should be server-side)
const ADMIN_CREDENTIALS = {
    email: 'admin@shirthub.com',
    password: 'Admin@123',
    securityCode: 'SH2024'
};

// Initialize admin panel
function initAdmin() {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('shirthub_admin_logged_in');
    
    if (isLoggedIn === 'true' && !window.location.pathname.includes('admin-login.html')) {
        // User is logged in, continue to dashboard
        loadAdminData();
    } else if (!window.location.pathname.includes('admin-login.html')) {
        // Redirect to login page
        window.location.href = 'admin-login.html';
    }
    
    // Initialize admin components
    initAdminLogin();
    initAdminLogout();
    initAdminDashboard();
    initProductManagement();
    initOrderManagement();
}

// Admin login
function initAdminLogin() {
    const loginForm = document.getElementById('adminLoginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const securityCode = document.getElementById('adminCode').value;
        
        // Validate credentials
        if (email === ADMIN_CREDENTIALS.email && 
            password === ADMIN_CREDENTIALS.password && 
            securityCode === ADMIN_CREDENTIALS.securityCode) {
            
            // Save login state
            localStorage.setItem('shirthub_admin_logged_in', 'true');
            localStorage.setItem('shirthub_admin_email', email);
            
            // Redirect to dashboard
            window.location.href = 'admin-dashboard.html';
            
        } else {
            // Show error
            const errorElement = document.getElementById('loginError');
            if (errorElement) {
                errorElement.style.display = 'flex';
                setTimeout(() => {
                    errorElement.style.display = 'none';
                }, 3000);
            }
        }
    });
}

// Admin logout
function initAdminLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('shirthub_admin_logged_in');
            localStorage.removeItem('shirthub_admin_email');
            window.location.href = 'admin-login.html';
        });
    }
}

// Load admin dashboard data
function loadAdminData() {
    // Load products
    const products = JSON.parse(localStorage.getItem('shirthub_products')) || [];
    
    // Load orders
    const orders = JSON.parse(localStorage.getItem('shirthub_orders')) || [];
    
    // Update dashboard stats
    updateDashboardStats(products, orders);
    
    // Load recent orders
    loadRecentOrders(orders);
    
    // Load stock alerts
    loadStockAlerts(products);
}

// Update dashboard statistics
function updateDashboardStats(products, orders) {
    // Total sales
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalSalesEl = document.getElementById('totalSales');
    if (totalSalesEl) {
        totalSalesEl.textContent = `$${totalSales.toFixed(2)}`;
    }
    
    // Total orders
    const totalOrdersEl = document.getElementById('totalOrders');
    if (totalOrdersEl) {
        totalOrdersEl.textContent = orders.length.toString();
    }
    
    // Total products
    const totalProductsEl = document.getElementById('totalProducts');
    if (totalProductsEl) {
        totalProductsEl.textContent = products.length.toString();
    }
    
    // Pending orders
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const pendingOrdersEl = document.getElementById('pendingOrders');
    if (pendingOrdersEl) {
        pendingOrdersEl.textContent = pendingOrders.toString();
    }
}

// Load recent orders
function loadRecentOrders(orders) {
    const container = document.getElementById('recentOrders');
    if (!container) return;
    
    // Get recent orders (last 5)
    const recentOrders = orders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    if (recentOrders.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No orders yet</td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    recentOrders.forEach(order => {
        html += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer.name}</td>
                <td>${formatDate(order.date)}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${order.status}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewOrder('${order.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" onclick="updateOrderStatus('${order.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    container.innerHTML = html;
}

// Load stock alerts
function loadStockAlerts(products) {
    const container = document.getElementById('stockAlerts');
    if (!container) return;
    
    // Get low stock products (stock <= 10)
    const lowStockProducts = products
        .filter(product => product.stock <= 10)
        .slice(0, 5);
    
    if (lowStockProducts.length === 0) {
        container.innerHTML = `
            <div class="alert-card">
                <div class="alert-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="alert-content">
                    <h4 class="alert-title">All stock levels are good</h4>
                    <p class="alert-text">No low stock alerts at this time.</p>
                </div>
            </div>
        `;
        return;
    }
    
    let html = '';
    lowStockProducts.forEach(product => {
        html += `
            <div class="alert-card">
                <div class="alert-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="alert-content">
                    <h4 class="alert-title">${product.name}</h4>
                    <p class="alert-text">
                        Stock: ${product.stock} units | 
                        SKU: ${product.sku}
                    </p>
                </div>
                <button class="btn btn-small" onclick="restockProduct('${product.id}')">
                    Restock
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Product management
function initProductManagement() {
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        initProductForm(addProductForm);
    }
    
    // Load products for edit page
    if (document.getElementById('productsList')) {
        loadProductsForEdit();
    }
}

// Initialize product form
function initProductForm(form) {
    // Image upload
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageUploadArea) {
        imageUploadArea.addEventListener('click', () => {
            document.getElementById('productImages').click();
        });
        
        const fileInput = document.getElementById('productImages');
        fileInput.addEventListener('change', handleImageUpload);
    }
    
    // Features management
    const addFeatureBtn = document.getElementById('addFeatureBtn');
    if (addFeatureBtn) {
        addFeatureBtn.addEventListener('click', addFeatureField);
    }
    
    // Form submission
    form.addEventListener('submit', handleProductFormSubmit);
}

// Handle image upload
function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    const preview = document.getElementById('imagePreview');
    
    files.forEach(file => {
        if (!file.type.match('image.*')) {
            showNotification('Please upload only images', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            addImageToPreview(imageUrl, preview);
        };
        reader.readAsDataURL(file);
    });
}

// Add image to preview
function addImageToPreview(imageUrl, preview) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'preview-image';
    imageDiv.innerHTML = `
        <img src="${imageUrl}" alt="Product image">
        <button type="button" class="remove-image">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Remove image button
    imageDiv.querySelector('.remove-image').addEventListener('click', () => {
        preview.removeChild(imageDiv);
    });
    
    preview.appendChild(imageDiv);
}

// Add feature field
function addFeatureField() {
    const container = document.getElementById('featuresContainer');
    const featureDiv = document.createElement('div');
    featureDiv.className = 'feature-input';
    featureDiv.innerHTML = `
        <input type="text" placeholder="Enter feature">
        <button type="button" class="btn-remove-feature">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Remove button
    featureDiv.querySelector('.btn-remove-feature').addEventListener('click', () => {
        container.removeChild(featureDiv);
    });
    
    container.appendChild(featureDiv);
}

// Handle product form submission
function handleProductFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSKU').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        comparePrice: parseFloat(document.getElementById('productComparePrice').value) || 0,
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value,
        features: getFeaturesFromForm(),
        sizes: getSelectedSizes(),
        seo: {
            title: document.getElementById('seoTitle').value,
            description: document.getElementById('seoDescription').value,
            keywords: document.getElementById('seoKeywords').value
        }
    };
    
    // Validate form
    if (!validateProductForm(formData)) {
        return;
    }
    
    // Add product
    const newProduct = Products.add(formData);
    
    // Clear form
    e.target.reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('featuresContainer').innerHTML = '';
    
    // Show success message
    showNotification('Product added successfully!', 'success');
    
    // Redirect to products list
    setTimeout(() => {
        window.location.href = 'admin-edit-product.html';
    }, 1500);
}

// Get features from form
function getFeaturesFromForm() {
    const featureInputs = document.querySelectorAll('#featuresContainer input[type="text"]');
    return Array.from(featureInputs)
        .map(input => input.value.trim())
        .filter(value => value.length > 0);
}

// Get selected sizes
function getSelectedSizes() {
    const selectedSizes = [];
    document.querySelectorAll('input[name="size"]:checked').forEach(checkbox => {
        selectedSizes.push(checkbox.value);
    });
    return selectedSizes;
}

// Validate product form
function validateProductForm(data) {
    if (!data.name || data.name.length < 3) {
        showNotification('Product name must be at least 3 characters', 'error');
        return false;
    }
    
    if (!data.sku) {
        showNotification('SKU is required', 'error');
        return false;
    }
    
    if (!data.price || data.price <= 0) {
        showNotification('Price must be greater than 0', 'error');
        return false;
    }
    
    if (!data.category) {
        showNotification('Please select a category', 'error');
        return false;
    }
    
    if (!data.description || data.description.length < 10) {
        showNotification('Description must be at least 10 characters', 'error');
        return false;
    }
    
    return true;
}

// Load products for edit page
function loadProductsForEdit() {
    const products = Products.getAll();
    const container = document.getElementById('productsList');
    
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No products found</td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    products.forEach(product => {
        html += `
            <tr>
                <td>
                    <div class="product-list-image">
                        <img src="${product.images[0] || 'images/products/default.jpg'}" alt="${product.name}">
                    </div>
                </td>
                <td>${product.name}</td>
                <td>${product.sku}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <span class="stock-level ${getStockLevelClass(product.stock)}">
                        ${product.stock} units
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="editProduct('${product.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteProductConfirm('${product.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    container.innerHTML = html;
}

// Get stock level class
function getStockLevelClass(stock) {
    if (stock <= 5) return 'very-low';
    if (stock <= 15) return 'low';
    if (stock <= 30) return 'medium';
    return 'good';
}

// Edit product
function editProduct(productId) {
    window.location.href = `admin-edit-product.html?id=${productId}`;
}

// Delete product confirmation
function deleteProductConfirm(productId) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        const success = Products.delete(productId);
        if (success) {
            loadProductsForEdit();
        }
    }
}

// Restock product
function restockProduct(productId) {
    const newStock = prompt('Enter new stock quantity:');
    if (newStock && !isNaN(newStock)) {
        Products.update(productId, { stock: parseInt(newStock) });
        loadStockAlerts(Products.getAll());
        showNotification('Stock updated successfully!', 'success');
    }
}

// Order management
function initOrderManagement() {
    if (document.getElementById('ordersList')) {
        loadAllOrders();
    }
}

// Load all orders
function loadAllOrders() {
    const orders = JSON.parse(localStorage.getItem('shirthub_orders')) || [];
    const container = document.getElementById('ordersList');
    
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No orders found</td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    orders.forEach(order => {
        html += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer.name}</td>
                <td>${order.customer.email}</td>
                <td>${formatDate(order.date)}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${order.status}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewOrder('${order.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" onclick="updateOrderStatus('${order.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    container.innerHTML = html;
}

// View order details
function viewOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('shirthub_orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }
    
    // Create modal content
    const modalContent = createOrderDetailsModal(order);
    showAdminModal('Order Details', modalContent);
}

// Create order details modal
function createOrderDetailsModal(order) {
    return `
        <div class="order-details-modal">
            <div class="order-details-grid">
                <div class="order-customer-info">
                    <h4>Customer Information</h4>
                    <p><strong>Name:</strong> ${order.customer.name}</p>
                    <p><strong>Email:</strong> ${order.customer.email}</p>
                    <p><strong>Phone:</strong> ${order.customer.phone}</p>
                </div>
                
                <div class="order-shipping-info">
                    <h4>Shipping Address</h4>
                    <p>${order.customer.address}</p>
                    <p>${order.customer.city}, ${order.customer.zip}</p>
                    <p>${order.customer.country}</p>
                </div>
                
                <div class="order-items-info">
                    <h4>Order Items</h4>
                    <table class="order-items-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Size</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.size}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${item.price.toFixed(2)}</td>
                                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="order-totals">
                        <div class="order-total-row">
                            <span>Subtotal:</span>
                            <span>$${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="order-total-row">
                            <span>Shipping:</span>
                            <span>${order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                        </div>
                        <div class="order-total-row">
                            <span>Tax:</span>
                            <span>$${order.tax.toFixed(2)}</span>
                        </div>
                        <div class="order-total-row grand-total">
                            <span>Total:</span>
                            <span>$${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="order-payment-info">
                    <h4>Payment Information</h4>
                    <p><strong>Method:</strong> ${order.payment === 'cod' ? 'Cash on Delivery' : order.payment}</p>
                    <p><strong>Status:</strong> 
                        <span class="status-badge status-${order.status}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Update order status
function updateOrderStatus(orderId) {
    const orders = JSON.parse(localStorage.getItem('shirthub_orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        showNotification('Order not found', 'error');
        return;
    }
    
    const currentStatus = orders[orderIndex].status;
    const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    const newStatus = statusOptions[nextIndex];
    
    // Update status
    orders[orderIndex].status = newStatus;
    localStorage.setItem('shirthub_orders', JSON.stringify(orders));
    
    // Refresh orders list
    if (document.getElementById('ordersList')) {
        loadAllOrders();
    }
    
    // Update recent orders
    if (document.getElementById('recentOrders')) {
        loadRecentOrders(orders);
    }
    
    showNotification(`Order status updated to: ${newStatus}`, 'success');
}

// Show admin modal
function showAdminModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'admin-modal active';
    modal.innerHTML = `
        <div class="admin-modal-content">
            <div class="admin-modal-header">
                <h3>${title}</h3>
                <button class="admin-modal-close">&times;</button>
            </div>
            <div class="admin-modal-body">${content}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal
    modal.querySelector('.admin-modal-close').addEventListener('click', () => {
        closeAdminModal(modal);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAdminModal(modal);
        }
    });
    
    return modal;
}

// Close admin modal
function closeAdminModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    }, 300);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Initialize admin dashboard
function initAdminDashboard() {
    if (document.querySelector('.admin-dashboard')) {
        loadAdminData();
        
        // Refresh data every 30 seconds
        setInterval(loadAdminData, 30000);
    }
}

// Global functions for inline event handlers
window.viewOrder = viewOrder;
window.updateOrderStatus = updateOrderStatus;
window.editProduct = editProduct;
window.deleteProductConfirm = deleteProductConfirm;
window.restockProduct = restockProduct;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', initAdmin);
