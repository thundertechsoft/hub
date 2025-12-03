// CART MANAGEMENT SYSTEM

let cart = [];

// Initialize cart
function initCart() {
    cart = JSON.parse(localStorage.getItem('shirthub_cart')) || [];
    updateCartCount();
}

// Add item to cart
function addToCart(product, quantity = 1, size = 'M') {
    const existingItemIndex = cart.findIndex(item => 
        item.id === product.id && item.size === size
    );
    
    if (existingItemIndex > -1) {
        // Update quantity if item already exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
            size: size,
            sku: product.sku
        });
    }
    
    saveCart();
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Dispatch cart updated event
    document.dispatchEvent(new CustomEvent('cartUpdated'));
}

// Remove item from cart
function removeFromCart(itemId, size) {
    cart = cart.filter(item => !(item.id === itemId && item.size === size));
    saveCart();
    showNotification('Item removed from cart', 'info');
    document.dispatchEvent(new CustomEvent('cartUpdated'));
}

// Update item quantity
function updateCartItemQuantity(itemId, size, newQuantity) {
    const itemIndex = cart.findIndex(item => 
        item.id === itemId && item.size === size
    );
    
    if (itemIndex > -1) {
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            // Remove item if quantity is 0
            cart.splice(itemIndex, 1);
        }
        saveCart();
        document.dispatchEvent(new CustomEvent('cartUpdated'));
    }
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    document.dispatchEvent(new CustomEvent('cartUpdated'));
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('shirthub_cart', JSON.stringify(cart));
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// Get cart item count
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Update cart count display
function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const totalItems = getCartItemCount();
    
    countElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Render cart items
function renderCartItems(containerId = 'cartItems') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some amazing shirts to your cart!</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-size">Size: ${item.size}</p>
                    <p class="cart-item-sku">SKU: ${item.sku}</p>
                </div>
                <div class="cart-item-price">
                    $${item.price.toFixed(2)}
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', '${item.size}', ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="10" 
                           onchange="updateQuantity('${item.id}', '${item.size}', this.value)">
                    <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', '${item.size}', ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="cart-item-remove" onclick="removeItem('${item.id}', '${item.size}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Update cart summary
function updateCartSummary() {
    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    // Update summary elements
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Initialize cart page
function initCartPage() {
    initCart();
    renderCartItems();
    updateCartSummary();
    
    // Add event listeners
    const checkoutBtn = document.getElementById('proceedCheckout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'warning');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
}

// Initialize checkout page
function initCheckoutPage() {
    initCart();
    renderCheckoutItems();
    updateCheckoutSummary();
    initPaymentMethods();
}

// Render checkout items
function renderCheckoutItems() {
    const container = document.getElementById('checkoutItems');
    if (!container) return;
    
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="checkout-item">
                <div class="checkout-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="checkout-item-details">
                    <h4>${item.name}</h4>
                    <p>Size: ${item.size} | Qty: ${item.quantity}</p>
                </div>
                <div class="checkout-item-price">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Update checkout summary
function updateCheckoutSummary() {
    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    // Update summary elements
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const shippingEl = document.getElementById('checkoutShipping');
    const taxEl = document.getElementById('checkoutTax');
    const totalEl = document.getElementById('checkoutTotal');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Initialize payment methods
function initPaymentMethods() {
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById('cardDetails');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });
}

// Process checkout
function processCheckout(formData) {
    // Validate form
    if (!ShirtHub.validateForm(document.getElementById('checkoutForm'))) {
        showNotification('Please fill all required fields correctly', 'error');
        return false;
    }
    
    // Create order
    const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        customer: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            zip: formData.zip,
            country: formData.country
        },
        items: [...cart],
        payment: formData.payment,
        subtotal: getCartTotal(),
        shipping: getCartTotal() > 50 ? 0 : 5.99,
        tax: getCartTotal() * 0.08,
        total: getCartTotal() + (getCartTotal() > 50 ? 0 : 5.99) + (getCartTotal() * 0.08),
        status: 'pending'
    };
    
    // Save order
    const orders = JSON.parse(localStorage.getItem('shirthub_orders')) || [];
    orders.push(order);
    localStorage.setItem('shirthub_orders', JSON.stringify(orders));
    
    // Clear cart
    clearCart();
    
    // Redirect to confirmation
    window.location.href = 'order-confirmation.html?order=' + order.id;
    
    return true;
}

// Global functions for inline event handlers
window.updateQuantity = function(itemId, size, newQuantity) {
    updateCartItemQuantity(itemId, size, parseInt(newQuantity));
    renderCartItems();
    updateCartSummary();
};

window.removeItem = function(itemId, size) {
    removeFromCart(itemId, size);
    renderCartItems();
    updateCartSummary();
};

// Export functions
window.Cart = {
    init: initCart,
    add: addToCart,
    remove: removeFromCart,
    updateQuantity: updateCartItemQuantity,
    clear: clearCart,
    getTotal: getCartTotal,
    getCount: getCartItemCount,
    render: renderCartItems,
    updateSummary: updateCartSummary,
    initCartPage: initCartPage,
    initCheckoutPage: initCheckoutPage,
    processCheckout: processCheckout
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', initCart);
