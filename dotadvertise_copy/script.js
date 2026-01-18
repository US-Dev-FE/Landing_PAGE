// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ===== LOADING SEQUENCE =====
    const loaderContainer = document.getElementById('loaderContainer');
    const splitAnimation = document.getElementById('splitAnimation');
    const mainContent = document.getElementById('mainContent');

    // Hide loader after 2.8 seconds
    setTimeout(() => {
        loaderContainer.style.display = 'none';
    }, 2800);

    // Hide split animation after 4 seconds
    setTimeout(() => {
        splitAnimation.style.display = 'none';
    }, 4000);

    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');

            // Animate hamburger to X
            const spans = menuToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(12px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-12px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking on a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ===== SATURN RING ENHANCED ANIMATION =====
    const saturnRing = document.getElementById('saturnRing');

    if (saturnRing) {
        // Add extra bounce on hover
        saturnRing.addEventListener('mouseenter', function () {
            saturnRing.style.animationPlayState = 'paused';
            saturnRing.style.transform = 'translateY(-30px) rotate(360deg) scale(1.2)';
            saturnRing.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        saturnRing.addEventListener('mouseleave', function () {
            saturnRing.style.transform = 'none';
            saturnRing.style.transition = 'none';
            setTimeout(() => {
                saturnRing.style.animationPlayState = 'running';
            }, 500);
        });
    }

    // ===== PARALLAX SCROLL EFFECT =====
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.gradient-blob, .shape-3d');

        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Saturn ring parallax
        if (saturnRing) {
            const saturnSpeed = 0.3;
            const saturnYPos = -(scrolled * saturnSpeed);
            saturnRing.style.transform = `translateY(${saturnYPos}px)`;
        }
    });

    // ===== SMOOTH SCROLL FOR NAVIGATION =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // ===== CURSOR GLOW EFFECT =====
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(184, 255, 60, 0.4) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.display = 'block';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });

    // Enhance cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .saturn-ring');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'radial-gradient(circle, rgba(184, 255, 60, 0.6) 0%, transparent 70%)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'radial-gradient(circle, rgba(184, 255, 60, 0.4) 0%, transparent 70%)';
        });
    });

    // ===== SPARKLE ANIMATION ON SCROLL =====
    const sparkles = document.querySelectorAll('.sparkle');

    window.addEventListener('scroll', function () {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        sparkles.forEach((sparkle, index) => {
            const rotation = scrollPercentage * (2 + index);
            sparkle.style.transform = `rotate(${rotation}deg)`;
        });
    });

    // ===== AVATAR INTERACTION =====
    const avatars = document.querySelectorAll('.avatar');

    avatars.forEach((avatar, index) => {
        avatar.addEventListener('mouseenter', function () {
            avatars.forEach((av, i) => {
                if (i !== index) {
                    av.style.transform = 'translateY(-5px) scale(0.9)';
                } else {
                    av.style.transform = 'translateY(-15px) scale(1.1)';
                }
            });
        });

        avatar.addEventListener('mouseleave', function () {
            avatars.forEach(av => {
                av.style.transform = 'none';
            });
        });
    });

    // ===== DYNAMIC GRADIENT BLOB MOVEMENT =====
    const blobs = document.querySelectorAll('.gradient-blob');

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;

            blob.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ===== PAGE VISIBILITY CHANGE =====
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            // Pause animations when tab is not visible
            document.body.style.animationPlayState = 'paused';
        } else {
            // Resume animations when tab is visible
            document.body.style.animationPlayState = 'running';
        }
    });

    // ===== PERFORMANCE OPTIMIZATION =====
    // Reduce animation on low-end devices
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduce-motion');
        // Disable complex animations
        const style = document.createElement('style');
        style.textContent = `
            .reduce-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== CONSOLE EASTER EGG =====
    console.log('%c🚀 DotAdvertise - Designing the Future', 'color: #B8FF3C; font-size: 20px; font-weight: bold;');
    console.log('%cWebsite crafted with precision and creativity', 'color: #40E0D0; font-size: 14px;');

    // ===== PERFORMANCE MONITORING =====
    window.addEventListener('load', function () {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    });

});

// ===== KEYBOARD NAVIGATION ENHANCEMENT =====
document.addEventListener('keydown', function (e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const menuToggle = document.getElementById('menuToggle');
            if (menuToggle) {
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    }
});

// ===== UTILITY FUNCTIONS =====

// Throttle function for scroll events
function throttle(func, wait) {
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

// Debounce function for resize events
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

// Apply throttled scroll handler
window.addEventListener('scroll', throttle(function () {
    // Your scroll handler here
}, 100));

// Apply debounced resize handler
window.addEventListener('resize', debounce(function () {
    // Your resize handler here
}, 250));