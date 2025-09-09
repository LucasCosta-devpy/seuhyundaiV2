/* ============================================================================
   HYUNDAI CRETA 2025 - AÇÃO ENTRE AMIGOS
   JavaScript Puro - Funcionalidades Interativas
============================================================================ */

// Configurações globais
const CONFIG = {
    participationUrl: 'https://rumomaisumarota.com.br/meucretadosonhos',
    carImages: [
        'assets/img/car1.jpeg',
        'assets/img/car2.jpeg',
        'assets/img/car3.jpeg',
        'assets/img/car4.jpeg',
        'assets/img/car 5.jpeg',
        'assets/img/car 6.jpeg'
    ]
};

// Estado da aplicação
let currentSlide = 0;
let isLoading = true;

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Função principal de inicialização
function initializeApp() {
    initializeLoading();
    initializeHeader();
    initializeCarousel();
    initializeScrollAnimations();
    initializeAnalytics();
    
    // Simular carregamento
    setTimeout(() => {
        hideLoading();
    }, 2000);
}

// ============================================================================
// LOADING SCREEN
// ============================================================================

function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Preload critical images
    preloadImages(CONFIG.carImages).then(() => {
        console.log('Images preloaded successfully');
    });
}

function hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        isLoading = false;
        
        // Start animations after loading
        startScrollAnimations();
    }
}

function preloadImages(imageUrls) {
    return Promise.all(
        imageUrls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
            });
        })
    );
}

// ============================================================================
// HEADER & NAVIGATION
// ============================================================================

function initializeHeader() {
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scroll-progress');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / documentHeight) * 100;
        
        // Update header appearance
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update progress bar
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }
    });
}

// ============================================================================
// IMAGE CAROUSEL
// ============================================================================

function initializeCarousel() {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!track || !dotsContainer) return;
    
    // Create dots
    CONFIG.carImages.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Auto-advance carousel
    setInterval(() => {
        if (!isLoading) {
            moveCarousel(1);
        }
    }, 5000);
}

function moveCarousel(direction) {
    const track = document.getElementById('carousel-track');
    const slides = track.children;
    const totalSlides = slides.length;
    
    currentSlide += direction;
    
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!track) return;
    
    // Move track
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // Track analytics
    trackEvent('carousel_view', {
        slide_index: currentSlide,
        slide_image: CONFIG.carImages[currentSlide]
    });
}

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

function initializeScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.level-card, .prize-card, .testimonial-card'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function startScrollAnimations() {
    // Add staggered animation delays
    const levelCards = document.querySelectorAll('.level-card');
    levelCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    const prizeCards = document.querySelectorAll('.prize-card');
    prizeCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// ============================================================================
// CTA FUNCTIONS
// ============================================================================

function openParticipationLink() {
    // Track click
    trackEvent('cta_click', {
        button_location: 'participation_link',
        url: CONFIG.participationUrl
    });
    
    // Open link
    window.open(CONFIG.participationUrl, '_blank', 'noopener,noreferrer');
}

// ============================================================================
// ANALYTICS & TRACKING
// ============================================================================

function initializeAnalytics() {
    // Track page view
    trackEvent('page_view', {
        page_title: document.title,
        page_url: window.location.href
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
            
            // Track milestone scroll depths
            if (scrollPercent >= 25 && scrollPercent < 30) {
                trackEvent('scroll_depth', { depth: '25%' });
            } else if (scrollPercent >= 50 && scrollPercent < 55) {
                trackEvent('scroll_depth', { depth: '50%' });
            } else if (scrollPercent >= 75 && scrollPercent < 80) {
                trackEvent('scroll_depth', { depth: '75%' });
            } else if (scrollPercent >= 90) {
                trackEvent('scroll_depth', { depth: '90%' });
            }
        }
    });
    
    // Track video interactions
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
        video.addEventListener('play', () => {
            trackEvent('video_play', { video_index: index });
        });
        
        video.addEventListener('pause', () => {
            trackEvent('video_pause', { video_index: index });
        });
        
        video.addEventListener('ended', () => {
            trackEvent('video_complete', { video_index: index });
        });
    });
}

function trackEvent(eventName, parameters = {}) {
    // Console log for debugging
    console.log(`Analytics Event: ${eventName}`, parameters);
    
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'CustomEvent', {
            event_name: eventName,
            ...parameters
        });
    }
    
    // Google Tag Manager
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            event: eventName,
            ...parameters
        });
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Debounce function
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

// Throttle function
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
    }
}

// ============================================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================================

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Optimize scroll performance
const optimizedScroll = throttle(() => {
    // Scroll-dependent operations here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScroll);

// ============================================================================
// ERROR HANDLING
// ============================================================================

window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
    trackEvent('javascript_error', {
        error_message: event.error.message,
        error_filename: event.filename,
        error_line: event.lineno
    });
});

// ============================================================================
// ACCESSIBILITY
// ============================================================================

// Keyboard navigation
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('carousel-btn')) {
            focusedElement.click();
        }
    }
    
    // Arrow key navigation for carousel
    if (event.key === 'ArrowLeft') {
        moveCarousel(-1);
    } else if (event.key === 'ArrowRight') {
        moveCarousel(1);
    }
});

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations
    document.documentElement.style.setProperty('--animation-duration', '0s');
}

// ============================================================================
// EXPORT FOR TESTING
// ============================================================================

// Make functions available globally for testing
window.HyundaiApp = {
    moveCarousel,
    goToSlide,
    openParticipationLink,
    trackEvent,
    scrollToElement
};

console.log('🚗 Hyundai Creta 2025 - Landing Page Initialized');
console.log('📊 Analytics tracking enabled');
console.log('🎯 Ready for user interaction');
