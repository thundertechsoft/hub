/**
 * SHIRT HUB - MAIN JAVASCRIPT FILE
 * Common functions for all pages
 */

// ============ GLOBAL VARIABLES ============
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [
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
        stock: 50
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
        stock: 30
    },
    {
        id: 3,
        name: "Designer Party Shirt - Black",
        category: "designer",
        price: 1899,
        originalPrice: 2499,
        discount: 24,
        rating: 4.9,
        reviews: 210,
        description: "Premium designer shirt for special occasions",
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Navy'],
        stock: 25
    },
    {
        id: 4,
        name: "100% Cotton Shirt - White",
        category: "cotton",
        price: 1499,
        originalPrice: 1999,
        discount: 25,
        rating: 4.7,
        reviews: 156,
        description: "Pure cotton shirt for maximum comfort",
        sizes: ['S', 'M', 'L'],
        colors: ['White', 'Beige'],
        stock: 40
    },
    {
        id: 5,
        name: "Striped Formal Shirt - Grey",
        category: "formal",
        price: 1199,
        originalPrice: 1699,
        discount: 29,
        rating: 4.6,
        reviews: 78,
        description: "Classic striped formal shirt",
        sizes: ['M', 'L', 'XL'],
        colors: ['Grey', 'Blue'],
        stock: 35
    },
    {
        id: 6,
        name: "Denim Casual Shirt - Blue",
        category: "casual",
        price: 1599,
        originalPrice: 2199,
        discount: 27,
        rating: 4.4,
        reviews: 92,
        description: "Stylish denim shirt for casual outings",
        sizes: ['S', 'M', 'L'],
        colors: ['Blue', 'Black'],
        stock: 20
    }
];

// ============ DOM READY FUNCTION ============
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();
    
    // Check current page and run specific functions
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index.html':
        case '':
        case 'index':
            loadFeaturedProducts();
            initializeAnimations();
            break;
            
        case 'products.html':
            loadAllProducts();
            setupFilters();
            break;
            
        case 'product-detail.html':
            loadProductDetail();
            setupProductTabs();
            loadRelatedProducts();
            break;
            
        case 'cart.html':
            loadCartItems();
            setupCartFunctions();
            break;
            
        case 'checkout.html':
            setupCheckout();
            break;
            
        case 'about.html':
            setupAboutPage();
            break;
            
        case 'contact.html':
            setupContactForm();
            setupFAQ();
            break;
    }
    
    // Initialize common animations
    initializeCommonAnimations();
});

// ============ HELPER FUNCTIONS ============
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop().replace('.html', '');
    return page || 'index';
}

function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00c9a7' : '#ff6b6b'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.onclick = () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    };
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
    
    // Add CSS animations
    const style = document.createElement('style');
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

// ============ CART FUNCTIONS ============
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: `product${productId}.jpg`
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showNotification('Product added to cart!');
    
    // Update cart page if open
    if (getCurrentPage() === 'cart') {
        loadCartItems();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
    showNotification('Product removed from cart');
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ============ HOME PAGE FUNCTIONS ============
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featuredProducts = products.slice(0, 4);
    
    container.innerHTML = featuredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <div class="front"></div>
                <div class="back"></div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    <span class="original-price">${formatPrice(product.originalPrice)}</span>
                    <span class="discount">${product.discount}% OFF</span>
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${getStarRating(product.rating)}
                        <span>${product.rating}/5 (${product.reviews})</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-view" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

function initializeAnimations() {
    // Initialize any animations for home page
    const shirtRotation = document.querySelector('.shirt-rotation');
    if (shirtRotation) {
        shirtRotation.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        shirtRotation.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }
}

// ============ PRODUCTS PAGE FUNCTIONS ============
function loadAllProducts() {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="product-image">
                <div class="front"></div>
                <div class="back"></div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    <span class="original-price">${formatPrice(product.originalPrice)}</span>
                    <span class="discount">${product.discount}% OFF</span>
                </div>
                <div class="product-category">
                    <span class="category-badge ${product.category}">${product.category.toUpperCase()}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-view" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.textContent.toLowerCase();
            filterProducts(filter);
        });
    });
}

function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// ============ PRODUCT DETAIL PAGE FUNCTIONS ============
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    
    const product = products.find(p => p.id === productId) || products[0];
    
    // Update page title and meta for SEO
    document.title = `${product.name} | Shirt Hub`;
    
    // Update product details
    const productName = document.querySelector('.product-detail-container h1');
    const productPrice = document.querySelector('.current-price');
    const originalPrice = document.querySelector('.original-price');
    const discount = document.querySelector('.discount');
    const rating = document.querySelector('.product-rating .stars');
    const description = document.querySelector('.product-desc p');
    
    if (productName) productName.textContent = product.name;
    if (productPrice) productPrice.textContent = formatPrice(product.price);
    if (originalPrice) originalPrice.textContent = formatPrice(product.originalPrice);
    if (discount) discount.textContent = `${product.discount}% OFF`;
    if (rating) rating.innerHTML = getStarRating(product.rating) + `<span>${product.rating}/5 (${product.reviews} reviews)</span>`;
    if (description) description.textContent = product.description;
    
    // Update size buttons
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        const size = button.textContent;
        if (product.sizes.includes(size)) {
            button.disabled = false;
            button.addEventListener('click', function() {
                sizeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        } else {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        }
    });
}

function setupProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabName = this.textContent.toLowerCase();
            const correspondingContent = document.querySelector(`.tab-content:nth-child(${Array.from(tabButtons).indexOf(this) + 1})`);
            if (correspondingContent) {
                correspondingContent.classList.add('active');
            }
        });
    });
}

function loadRelatedProducts() {
    const container = document.getElementById('relatedProducts');
    if (!container) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const currentProductId = parseInt(urlParams.get('id')) || 1;
    
    // Get related products (same category, excluding current)
    const currentProduct = products.find(p => p.id === currentProductId);
    const relatedProducts = products.filter(p => 
        p.category === currentProduct.category && p.id !== currentProductId
    ).slice(0, 4);
    
    if (relatedProducts.length === 0) {
        // If no same category, show random products
        relatedProducts = products.filter(p => p.id !== currentProductId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }
    
    container.innerHTML = relatedProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <div class="front"></div>
                <div class="back"></div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    <span class="original-price">${formatPrice(product.originalPrice)}</span>
                    <span class="discount">${product.discount}% OFF</span>
                </div>
                <div class="product-actions">
                    <button class="btn-add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add
                    </button>
                    <button class="btn-view" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function buyNow() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    
    // Add to cart
    addToCart(productId, 1);
    
    // Show payment modal
    showPaymentModal();
}

function showPaymentModal() {
    const modal = document.getElementById('buyModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('buyModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ============ CART PAGE FUNCTIONS ============
function loadCartItems() {
    const container = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <a href="products.html" class="btn-primary">Shop Now</a>
            </div>
        `;
        if (subtotalElement) subtotalElement.textContent = '0';
        if (totalElement) totalElement.textContent = '0';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image"></div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update totals
    const subtotal = getCartTotal();
    const total = subtotal; // Add shipping/discount logic here
    
    if (subtotalElement) subtotalElement.textContent = subtotal.toLocaleString('en-IN');
    if (totalElement) totalElement.textContent = total.toLocaleString('en-IN');
}

function setupCartFunctions() {
    const couponBtn = document.querySelector('.coupon-box button');
    const couponInput = document.getElementById('couponCode');
    
    if (couponBtn) {
        couponBtn.addEventListener('click', applyCoupon);
    }
    
    if (couponInput) {
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyCoupon();
            }
        });
    }
}

function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value;
    const discountElement = document.getElementById('discount');
    
    // Simple coupon validation
    const validCoupons = {
        'SHIRT10': 10,
        'WELCOME20': 20,
        'SAVE50': 50
    };
    
    if (validCoupons[couponCode]) {
        const discount = validCoupons[couponCode];
        const subtotal = getCartTotal();
        const discountAmount = (subtotal * discount) / 100;
        
        if (discountElement) {
            discountElement.textContent = discountAmount.toLocaleString('en-IN');
        }
        
        // Update total
        const totalElement = document.getElementById('total');
        const total = subtotal - discountAmount;
        
        if (totalElement) {
            totalElement.textContent = total.toLocaleString('en-IN');
        }
        
        showNotification(`Coupon applied! ${discount}% discount`);
    } else {
        showNotification('Invalid coupon code', 'error');
    }
}

function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    window.location.href = 'checkout.html';
}

// ============ CHECKOUT PAGE FUNCTIONS ============
function setupCheckout() {
    // Load cart summary
    const subtotal = getCartTotal();
    document.getElementById('subtotal').textContent = subtotal.toLocaleString('en-IN');
    document.getElementById('total').textContent = subtotal.toLocaleString('en-IN');
    
    // Setup payment options
    setupPaymentOptions();
    
    // Setup form validation
    setupFormValidation();
}

function setupPaymentOptions() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Show corresponding form
            const paymentMethod = this.querySelector('span').textContent.toLowerCase();
            showPaymentForm(paymentMethod);
        });
    });
}

function showPaymentForm(method) {
    // Hide all forms
    document.getElementById('cardForm').style.display = 'none';
    document.getElementById('easypaisaForm').style.display = 'none';
    
    // Show selected form
    if (method.includes('card')) {
        document.getElementById('cardForm').style.display = 'block';
    } else if (method.includes('easypaisa')) {
        document.getElementById('easypaisaForm').style.display = 'block';
    }
}

function setupFormValidation() {
    const form = document.getElementById('shippingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ff6b6b';
                    isValid = false;
                } else {
                    input.style.borderColor = '#e9ecef';
                }
            });
            
            if (isValid) {
                placeOrder();
            } else {
                showNotification('Please fill all required fields', 'error');
            }
        });
    }
}

function placeOrder() {
    showNotification('Processing your order...', 'success');
    
    // Simulate payment processing
    setTimeout(() => {
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show success message
        showNotification('Order placed successfully! Thank you for shopping with us.');
        
        // Redirect to thank you page (you can create this)
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 2000);
}

// ============ ABOUT PAGE FUNCTIONS ============
function setupAboutPage() {
    // Add any animations or interactions for about page
    const stats = document.querySelectorAll('.stat h3');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const suffix = stat.nextElementSibling.textContent.includes('+') ? '+' : '';
        animateCounter(stat, target, suffix);
    });
}

function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 20);
}

// ============ CONTACT PAGE FUNCTIONS ============
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ff6b6b';
                    isValid = false;
                } else {
                    input.style.borderColor = '#e9ecef';
                }
            });
            
            if (isValid) {
                // Simulate form submission
                showNotification('Message sent successfully! We\'ll contact you soon.');
                form.reset();
            } else {
                showNotification('Please fill all required fields', 'error');
            }
        });
    }
}

function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');
            
            // Toggle answer visibility
            const answer = this.nextElementSibling;
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// ============ COMMON ANIMATIONS ============
function initializeCommonAnimations() {
    // Add scroll animations
    const animatedElements = document.querySelectorAll('.product-card, .category-card, .value-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-add-to-cart, .btn-view');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ============ PAYMENT PROCESSING ============
function processCardPayment() {
    showNotification('Processing card payment...');
    // Add actual payment gateway integration here
    setTimeout(() => {
        showNotification('Payment successful! Order confirmed.');
        closeModal();
    }, 2000);
}

function processEasypaisa() {
    showNotification('Redirecting to Easypaisa...');
    // Add Easypaisa API integration here
    setTimeout(() => {
        showNotification('Easypaisa payment initiated.');
        closeModal();
    }, 1000);
}

// ============ ADMIN FUNCTIONS ============
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin-login.html';
}

// ============ WINDOW EVENT LISTENERS ============
// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('buyModal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

// Close modal with ESC key
window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.viewProduct = viewProduct;
window.buyNow = buyNow;
window.closeModal = closeModal;
window.processCardPayment = processCardPayment;
window.processEasypaisa = processEasypaisa;
window.applyCoupon = applyCoupon;
window.goToCheckout = goToCheckout;
window.placeOrder = placeOrder;
window.logout = logout;
