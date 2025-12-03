// ANIMATIONS AND INTERACTIONS

// Initialize animations
function initAnimations() {
    initHeroSlider();
    initCounterAnimations();
    initHoverEffects();
    initScrollReveal();
    initImageParallax();
    initStaggeredAnimations();
    initProgressBars();
    initTypewriterEffect();
}

// Hero Slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    // Show slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        showSlide(nextIndex);
    }
    
    // Previous slide
    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) prevIndex = slides.length - 1;
        showSlide(prevIndex);
    }
    
    // Auto slide
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Stop auto slide
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });
    
    // Start auto slide
    startAutoSlide();
    
    // Pause on hover
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoSlide);
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count') || counter.textContent);
                const duration = parseInt(counter.getAttribute('data-duration') || 2000);
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Hover Effects
function initHoverEffects() {
    // Tilt effect for cards
    const tiltElements = document.querySelectorAll('.tilt-effect');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 5;
            const rotateX = ((centerY - y) / centerY) * 5;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            element.style.transition = 'transform 0.5s ease';
        });
        
        element.addEventListener('mouseenter', () => {
            element.style.transition = 'transform 0.1s ease';
        });
    });
    
    // Hover glow effect
    const glowElements = document.querySelectorAll('.hover-glow');
    
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.classList.add('glow');
        });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('glow');
        });
    });
    
    // Button ripple effect
    const rippleButtons = document.querySelectorAll('.btn-ripple');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Scroll Reveal Animations
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if (revealElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;
                const duration = element.getAttribute('data-duration') || 0.6;
                
                element.style.animationDelay = delay + 's';
                element.style.animationDuration = duration + 's';
                element.classList.add('animated');
                
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => observer.observe(element));
}

// Image Parallax
function initImageParallax() {
    const parallaxImages = document.querySelectorAll('.image-parallax');
    
    if (parallaxImages.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    window.addEventListener('scroll', () => {
        parallaxImages.forEach(image => {
            const speed = parseFloat(image.getAttribute('data-speed')) || 0.5;
            const yPos = -(window.pageYOffset * speed);
            image.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
}

// Staggered Animations
function initStaggeredAnimations() {
    const staggeredContainers = document.querySelectorAll('.stagger-animate');
    
    staggeredContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            child.style.animationDelay = `${index * 0.1}s`;
            child.classList.add('animate-fade-in');
        });
    });
}

// Progress Bars
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    if (progressBars.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width') || '100%';
                progressBar.style.width = width;
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Typewriter Effect
function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const speed = parseInt(element.getAttribute('data-speed')) || 50;
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        // Start typing when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
}

// Floating Elements
function initFloatingElements() {
    const floatElements = document.querySelectorAll('.float-element');
    
    floatElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-speed')) || 1;
        const amplitude = parseFloat(element.getAttribute('data-amplitude')) || 10;
        
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            
            const y = Math.sin(elapsed * 0.001 * speed) * amplitude;
            element.style.transform = `translateY(${y}px)`;
            
            requestAnimationFrame(animate);
        }
        
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            requestAnimationFrame(animate);
        }
    });
}

// Particle Background
function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initParticles();
    }
    
    // Initialize particles
    function initParticles() {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                color: `rgba(67, 97, 238, ${Math.random() * 0.5 + 0.1})`
            });
        }
    }
    
    // Draw particles
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Draw connections
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(67, 97, 238, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(drawParticles);
    }
    
    // Initialize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();
}

// Cursor Effect
function initCursorEffect() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animate cursor
    function animateCursor() {
        // Smooth follow
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    // Cursor effects on hover
    const hoverElements = document.querySelectorAll('a, button, .hover-effect');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
    
    animateCursor();
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', initAnimations);

// Export animation functions
window.Animations = {
    init: initAnimations,
    initHeroSlider: initHeroSlider,
    initCounterAnimations: initCounterAnimations,
    initHoverEffects: initHoverEffects,
    initScrollReveal: initScrollReveal,
    initParticleBackground: initParticleBackground,
    initCursorEffect: initCursorEffect
};
