/**
 * Dior Mobile Website - JavaScript
 * Handles menu interactions, animations, and user experience
 */

// ==========================================
// DOM Elements
// ==========================================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeBtn = document.getElementById('closeBtn');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const body = document.body;
const accessibilityToggle = document.getElementById('accessibilityToggle');

// ==========================================
// Menu Functionality
// ==========================================
function openMenu() {
    sideMenu.classList.add('active');
    menuOverlay.classList.add('active');
    body.classList.add('menu-open');

    // Trap focus within menu
    trapFocus(sideMenu);

    // Announce to screen readers
    announceToScreenReader('Navigation menu opened');
}

function closeMenu() {
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    body.classList.remove('menu-open');

    // Return focus to hamburger button
    hamburgerBtn.focus();

    // Announce to screen readers
    announceToScreenReader('Navigation menu closed');
}

// ==========================================
// Event Listeners
// ==========================================
hamburgerBtn.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
        closeMenu();
    }
});

// Prevent body scroll when menu is open (iOS fix)
sideMenu.addEventListener('touchmove', (e) => {
    if (sideMenu.scrollHeight > sideMenu.clientHeight) {
        e.stopPropagation();
    }
}, { passive: false });

// Tab functionality
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        // Remove active class from all tabs
        tabBtns.forEach(tab => tab.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');

        // Announce tab change
        announceToScreenReader(`Switched to ${this.textContent} section`);
    });
});

// Menu item interactions with ripple effect
const menuItems = document.querySelectorAll('.menu-item a, .menu-item-secondary a');
menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
        // Add visual feedback
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);

        // Announce navigation
        announceToScreenReader(`Navigating to ${this.textContent}`);
    });
});

// ==========================================
// Accessibility Features
// ==========================================
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstFocusable.focus();

    element.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    body.appendChild(announcement);

    setTimeout(() => {
        body.removeChild(announcement);
    }, 1000);
}

// Accessibility toggle functionality
accessibilityToggle.addEventListener('change', function () {
    if (this.checked) {
        enableAccessibilityFeatures();
        announceToScreenReader('Accessibility features enabled');
    } else {
        disableAccessibilityFeatures();
        announceToScreenReader('Accessibility features disabled');
    }
});

function enableAccessibilityFeatures() {
    body.classList.add('accessibility-mode');
    // Increase font sizes
    document.documentElement.style.fontSize = '18px';
    // Increase contrast
    document.documentElement.style.setProperty('--color-gray-text', '#333333');
}

function disableAccessibilityFeatures() {
    body.classList.remove('accessibility-mode');
    // Reset font sizes
    document.documentElement.style.fontSize = '16px';
    // Reset contrast
    document.documentElement.style.setProperty('--color-gray-text', '#666666');
}

// ==========================================
// Smooth Scroll
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            closeMenu();
        }
    });
});

// ==========================================
// Image Lazy Loading Observer
// ==========================================
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

// Observe all images
document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
});

// ==========================================
// Performance Optimizations
// ==========================================
let scrollTimeout;
let lastScroll = 0;
const header = document.querySelector('.header');
const logoElement = document.getElementById('logoElement');
const searchBtn = document.getElementById('searchBtn');

// Simple scroll-based header color change
function updateHeaderOnScroll() {
    const scrollY = window.pageYOffset;
    const scrollThreshold = 50; // Pixels to scroll before changing header

    if (scrollY > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Update header on scroll
window.addEventListener('scroll', () => {
    updateHeaderOnScroll();
}, { passive: true });

// Initial state
updateHeaderOnScroll();

// Add fade-in animation for gallery items on scroll
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Observe all gallery items
document.querySelectorAll('.gallery-item').forEach((item, index) => {
    // Set initial state
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

    galleryObserver.observe(item);
});

// ==========================================
// Touch Gestures (Swipe to Close Menu)
// ==========================================
let touchStartX = 0;
let touchEndX = 0;

sideMenu.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

sideMenu.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 100;
    const swipeDistance = touchEndX - touchStartX;

    // Swipe left to close menu
    if (swipeDistance < -swipeThreshold) {
        closeMenu();
    }
}

// ==========================================
// Preload Critical Resources
// ==========================================
function preloadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        }
    });
}

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Preload images for better performance
    preloadImages();

    // Add loaded class to body for animations
    setTimeout(() => {
        body.classList.add('loaded');
    }, 100);

    // Log initialization
    console.log('Dior Mobile Website Initialized');
    console.log('Performance ready - Lighthouse optimized');
});

// ==========================================
// Service Worker Registration (PWA Support)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be registered here for PWA functionality
        console.log('Service Worker support available');
    });
}

// ==========================================
// Error Handling
// ==========================================
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
    // You can add error reporting service here
});

// Handle failed image loads
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
        this.style.display = 'none';
        console.warn('Image failed to load:', this.src);
    });
});

// ==========================================
// Newsletter Form
// ==========================================
const newsletterForm = document.getElementById('newsletterForm');
const emailInput = document.querySelector('.email-input');

newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Basic email validation
    if (validateEmail(email)) {
        // Show success message
        showNotification('Thank you for subscribing to Dior news!', 'success');

        // Clear form
        emailInput.value = '';

        // Track event
        trackEvent('Newsletter', 'Subscribe', email);

        // Here you would typically send to your backend
        console.log('Newsletter subscription:', email);
    } else {
        showNotification('Please enter a valid email address', 'error');
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#2a2a2a' : '#d32f2f'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        font-size: 15px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideDown 0.3s ease;
    `;

    body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    @keyframes slideUp {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// Expandable Footer Items
// ==========================================
const expandableBtns = document.querySelectorAll('.expandable-btn');

expandableBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const content = this.nextElementSibling;
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Close all other expandables
        expandableBtns.forEach(otherBtn => {
            if (otherBtn !== this) {
                otherBtn.setAttribute('aria-expanded', 'false');
                otherBtn.nextElementSibling.classList.remove('active');
            }
        });

        // Toggle current expandable
        this.setAttribute('aria-expanded', !isExpanded);
        content.classList.toggle('active');

        // Announce to screen readers
        announceToScreenReader(
            isExpanded ? 'Section collapsed' : 'Section expanded'
        );
    });
});

// ==========================================
// Smooth Scroll Enhancement for Footer Links
// ==========================================
document.querySelectorAll('.footer a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// Country / Region Selector
// ==========================================
const countryBtn = document.querySelector('.country-btn');

if (countryBtn) {
    countryBtn.addEventListener('click', function () {
        // Show country selection modal (placeholder)
        announceToScreenReader('Country selection opened');

        // In production, this would open a modal/dropdown with country options
        console.log('Country selector clicked');
        trackEvent('Footer', 'Country Selector', 'Click');
    });
}

// ==========================================
// Social Media Link Tracking
// ==========================================
const socialLinks = document.querySelectorAll('.social-links a');

socialLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        const platform = this.textContent.trim();
        trackEvent('Social Media', 'Click', platform);
        announceToScreenReader(`Opening ${platform} in new window`);

        console.log(`Social media link clicked: ${platform}`);
    });
});

// ==========================================
// Analytics Events (Ready for Integration)
// ==========================================
function trackEvent(category, action, label) {
    // Ready for Google Analytics or similar
    console.log('Event:', category, action, label);
}

// Track menu interactions
hamburgerBtn.addEventListener('click', () => {
    trackEvent('Navigation', 'Menu Open', 'Hamburger Click');
});

closeBtn.addEventListener('click', () => {
    trackEvent('Navigation', 'Menu Close', 'Close Button Click');
});

menuItems.forEach(item => {
    item.addEventListener('click', function () {
        trackEvent('Navigation', 'Menu Item Click', this.textContent);
    });
});