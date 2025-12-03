// PRODUCTS MANAGEMENT SYSTEM

let products = [];

// Product Schema
const productSchema = {
    id: '',
    sku: '',
    name: '',
    description: '',
    price: 0,
    comparePrice: 0,
    category: '',
    tags: [],
    images: [],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 0,
    features: [],
    rating: 0,
    reviews: 0,
    createdAt: '',
    updatedAt: ''
};

// Initialize products
async function initProducts() {
    try {
        // Try to load from localStorage first
        const storedProducts = localStorage.getItem('shirthub_products');
        
        if (storedProducts) {
            products = JSON.parse(storedProducts);
        } else {
            // Load from JSON file if no localStorage data
            await loadProductsFromJSON();
        }
        
        return products;
    } catch (error) {
        console.error('Error initializing products:', error);
        showNotification('Error loading products', 'error');
        return [];
    }
}

// Load products from JSON file
async function loadProductsFromJSON() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error('Failed to load products');
        
        products = await response.json();
        localStorage.setItem('shirthub_products', JSON.stringify(products));
        return products;
    } catch (error) {
        console.error('Error loading products from JSON:', error);
        // Create sample products if JSON doesn't exist
        createSampleProducts();
        return products;
    }
}

// Create sample products (for initial setup)
function createSampleProducts() {
    products = [
        {
            id: '1',
            sku: 'SH-001',
            name: 'Premium Cotton Shirt',
            description: '100% premium cotton shirt with excellent breathability and comfort.',
            price: 49.99,
            comparePrice: 59.99,
            category: 'men',
            tags: ['cotton', 'premium', 'casual'],
            images: ['images/products/shirt1.jpg'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            stock: 100,
            features: ['100% Cotton', 'Breathable Fabric', 'Easy to Iron'],
            rating: 4.5,
            reviews: 128,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // Add more sample products as needed
    ];
    
    localStorage.setItem('shirthub_products', JSON.stringify(products));
}

// Get all products
function getAllProducts() {
    return products;
}

// Get featured products
function getFeaturedProducts(limit = 8) {
    return products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Get products by category
function getProductsByCategory(category, limit = null) {
    let filtered = products.filter(product => product.category === category);
    
    if (limit) {
        filtered = filtered.slice(0, limit);
    }
    
    return filtered;
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Get related products
function getRelatedProducts(productId, limit = 4) {
    const product = getProductById(productId);
    if (!product) return [];
    
    return products
        .filter(p => p.id !== productId && p.category === product.category)
        .slice(0, limit);
}

// Add new product
function addProduct(productData) {
    const newProduct = {
        ...productSchema,
        ...productData,
        id: 'PROD-' + Date.now(),
        sku: productData.sku || 'SH-' + (products.length + 1).toString().padStart(3, '0'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    saveProducts();
    
    showNotification('Product added successfully!', 'success');
    return newProduct;
}

// Update product
function updateProduct(productId, updates) {
    const index = products.findIndex(p => p.id === productId);
    
    if (index === -1) {
        showNotification('Product not found', 'error');
        return null;
    }
    
    products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    
    saveProducts();
    showNotification('Product updated successfully!', 'success');
    return products[index];
}

// Delete product
function deleteProduct(productId) {
    const index = products.findIndex(p => p.id === productId);
    
    if (index === -1) {
        showNotification('Product not found', 'error');
        return false;
    }
    
    products.splice(index, 1);
    saveProducts();
    showNotification('Product deleted successfully!', 'success');
    return true;
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('shirthub_products', JSON.stringify(products));
}

// Render product card
function renderProductCard(product) {
    const discount = product.comparePrice > product.price 
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;
    
    return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.images[0] || 'images/products/default.jpg'}" alt="${product.name}">
                <div class="product-badges">
                    ${product.stock <= 10 ? '<span class="badge badge-hot">Low Stock</span>' : ''}
                    ${discount > 0 ? `<span class="badge badge-sale">Save ${discount}%</span>` : ''}
                    <span class="badge badge-new">New</span>
                </div>
                <button class="btn-quick-view" onclick="openQuickView('${product.id}')">
                    <i class="fas fa-eye"></i> Quick View
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.comparePrice > product.price 
                        ? `<span class="old-price">$${product.comparePrice.toFixed(2)}</span>`
                        : ''
                    }
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${renderStars(product.rating)}
                    </div>
                    <span class="rating-text">${product.rating} (${product.reviews})</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-add-to-cart" onclick="Cart.add(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-wishlist" onclick="addToWishlist('${product.id}')">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Render stars for rating
function renderStars(rating) {
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

// Load products to grid
async function loadProductsToGrid(containerId, filter = 'all', sort = 'default', limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Show loading
    container.innerHTML = `
        <div class="loading-products">
            <div class="spinner"></div>
            <p>Loading products...</p>
        </div>
    `;
    
    try {
        await initProducts();
        
        // Filter products
        let filteredProducts = filter === 'all' 
            ? products 
            : products.filter(p => p.category === filter);
        
        // Sort products
        switch (sort) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }
        
        // Apply limit
        if (limit) {
            filteredProducts = filteredProducts.slice(0, limit);
        }
        
        // Render products
        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-tshirt"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = filteredProducts.map(renderProductCard).join('');
        
        // Initialize product card animations
        setTimeout(() => {
            const productCards = container.querySelectorAll('.product-card');
            productCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.05}s`;
                card.classList.add('animate-fade-in');
            });
        }, 100);
        
    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML = `
            <div class="error-loading">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error loading products</h3>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// Load featured products
function loadFeaturedProducts() {
    loadProductsToGrid('featured-products', 'all', 'rating', 8);
}

// Load all products for shop page
function loadAllProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    const sort = document.getElementById('sortProducts')?.value || 'default';
    
    loadProductsToGrid('productsGrid', category, sort);
}

// Initialize product filters
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortProducts');
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Load products with filter
            const filter = button.dataset.filter;
            const sort = sortSelect?.value || 'default';
            loadProductsToGrid('productsGrid', filter, sort);
        });
    });
    
    // Sort select
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const activeFilter = document.querySelector('.filter-btn.active');
            const filter = activeFilter?.dataset.filter || 'all';
            const sort = sortSelect.value;
            loadProductsToGrid('productsGrid', filter, sort);
        });
    }
}

// Quick view modal
function openQuickView(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const modalContent = `
        <div class="quick-view-modal">
            <div class="quick-view-content">
                <div class="quick-view-images">
                    <img src="${product.images[0]}" alt="${product.name}">
                </div>
                <div class="quick-view-details">
                    <h2>${product.name}</h2>
                    <div class="quick-view-price">$${product.price.toFixed(2)}</div>
                    <div class="quick-view-rating">
                        ${renderStars(product.rating)}
                        <span>${product.rating} (${product.reviews} reviews)</span>
                    </div>
                    <p class="quick-view-description">${product.description}</p>
                    <div class="quick-view-actions">
                        <button class="btn btn-primary" onclick="Cart.add(${JSON.stringify(product).replace(/"/g, '&quot;')}); closeModal()">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <a href="product-details.html?id=${product.id}" class="btn btn-secondary">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal('Quick View', modalContent);
}

// Show modal
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">${content}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            }, 300);
        }
    });
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal.active');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    }
}

// Wishlist functionality
function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('shirthub_wishlist')) || [];
    
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('shirthub_wishlist', JSON.stringify(wishlist));
        showNotification('Added to wishlist!', 'success');
    } else {
        wishlist = wishlist.filter(id => id !== productId);
        localStorage.setItem('shirthub_wishlist', JSON.stringify(wishlist));
        showNotification('Removed from wishlist', 'info');
    }
}

// Export functions
window.Products = {
    init: initProducts,
    getAll: getAllProducts,
    getFeatured: getFeaturedProducts,
    getByCategory: getProductsByCategory,
    getById: getProductById,
    getRelated: getRelatedProducts,
    add: addProduct,
    update: updateProduct,
    delete: deleteProduct,
    renderCard: renderProductCard,
    loadToGrid: loadProductsToGrid,
    loadFeatured: loadFeaturedProducts,
    loadAll: loadAllProducts,
    initFilters: initProductFilters,
    openQuickView: openQuickView
};

// Initialize products on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load products on shop page
    if (document.getElementById('productsGrid')) {
        loadAllProducts();
        initProductFilters();
    }
    
    // Load featured products on homepage
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }
});
