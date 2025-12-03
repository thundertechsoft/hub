// MAIN JAVASCRIPT FILE
// This file contains common functionality for all pages

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all common components
    initCommonComponents();
    initMobileMenu();
    initCartCount();
    initScrollAnimations();
    initParallaxEffects();
    initSmoothScrolling();
    initTooltips();
    initNotifications();
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduced-motion');
    }
});

// COMMON COMPONENTS INITIALIZATION
function initCommonComponents() {
    // Initialize dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            dropdown.classList.add('open');
        });
        
        dropdown.addEventListener('mouseleave', () => {
            dropdown.classList.remove('open');
        });
    });
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize modals
    initModals();
    
    // Initialize accordions
    initAccordions();
    
    // Initialize tabs
    initTabs();
}

// MOBILE MENU TOGGLE
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Toggle aria-expanded attribute
            const isExpanded = navMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// CART COUNT MANAGEMENT
function initCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        updateCartCount();
        // Listen for cart updates
        document.addEventListener('cartUpdated', updateCartCount);
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('shirthub_cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// SCROLL ANIMATIONS
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for children
                const staggerChildren = entry.target.querySelector('.stagger-children');
                if (staggerChildren) {
                    const children = staggerChildren.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.animationDelay = `${index * 0.1}s`;
                        child.classList.add('animate-fade-in');
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
    
    // Header scroll effect
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// PARALLAX EFFECTS
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', () => {
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(window.pageYOffset * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });
    }
}

// SMOOTH SCROLLING
function initSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// TOOLTIPS
function initTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', () => {
            const tooltipText = tooltip.querySelector('.tooltip-text');
            if (tooltipText) {
                tooltipText.style.opacity = '1';
                tooltipText.style.visibility = 'visible';
                tooltipText.style.transform = 'translateX(-50%) translateY(-5px)';
            }
        });
        
        tooltip.addEventListener('mouseleave', () => {
            const tooltipText = tooltip.querySelector('.tooltip-text');
            if (tooltipText) {
                tooltipText.style.opacity = '0';
                tooltipText.style.visibility = 'hidden';
                tooltipText.style.transform = 'translateX(-50%) translateY(0)';
            }
        });
    });
}

// MODALS
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    
    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// ACCORDIONS
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}

// TABS
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            const tabContainer = button.closest('.tabs').nextElementSibling;
            
            // Remove active class from all buttons and contents
            button.closest('.tabs').querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabContent = document.getElementById(`${tabId}Tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// NOTIFICATIONS SYSTEM
function initNotifications() {
    window.showNotification = function(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove
        const autoRemove = setTimeout(() => {
            closeNotification(notification);
        }, duration);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            closeNotification(notification);
        });
        
        return notification;
    };
    
    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    function closeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// FORM VALIDATION HELPER
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
        
        // Email validation
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                input.classList.add('error');
                isValid = false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(input.value.trim().replace(/[^\d+]/g, ''))) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// LOADING STATE MANAGEMENT
function showLoading() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'flex';
        setTimeout(() => {
            loader.style.opacity = '1';
        }, 10);
    }
}

function hideLoading() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

// API/STORAGE HELPER FUNCTIONS
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showNotification('Error saving data', 'error');
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// DEBOUNCE FUNCTION
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

// THROTTLE FUNCTION
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// PAGE LOADER
window.addEventListener('load', function() {
    hideLoading();
});

// ERROR HANDLING
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// EXPORT FUNCTIONS FOR USE IN OTHER FILES
window.ShirtHub = {
    showNotification,
    validateForm,
    saveToLocalStorage,
    getFromLocalStorage,
    debounce,
    throttle
};
