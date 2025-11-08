// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });
});

// Counter Animation for Stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Intersection Observer for Counter Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(entry.target);
        }
    });
}, observerOptions);

// Initialize counters on page load and observe for scroll
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');

    // Set initial values immediately
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        stat.textContent = target;
    });

    // Then observe for animation when scrolled into view
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#refund-policy' && href !== '#privacy-policy' && href !== '#terms') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Navbar Background on Scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 11, 30, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.05)';
        navbar.style.backdropFilter = 'blur(20px)';
    }

    lastScroll = currentScroll;
});

// Parallax Effect for Gradient Orbs
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.1;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Modal Functions
function openLeadModal() {
    console.log('🔵 openLeadModal called');
    const modal = document.getElementById('leadModal');
    if (!modal) {
        console.error('❌ Modal element not found!');
        return;
    }
    console.log('✅ Modal element found:', modal);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Add entrance animation
    setTimeout(() => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
            console.log('✅ Modal animation applied');
        } else {
            console.error('❌ Modal content not found!');
        }
    }, 10);
}

function closeLeadModal() {
    const modal = document.getElementById('leadModal');
    const modalContent = modal.querySelector('.modal-content');

    // Add exit animation
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'translateY(30px)';

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('leadModal');
        if (modal.style.display === 'flex') {
            closeLeadModal();
        }
    }
});

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;

    // Show loading state
    button.disabled = true;
    button.innerHTML = '<span>Processing...</span>';
    button.style.opacity = '0.7';

    const formData = new FormData(event.target);
    const data = {
        firstName: formData.get('firstName'),
        email: formData.get('email'),
        countryCode: formData.get('countryCode'),
        phone: formData.get('phone')
    };

    console.log('Form submitted:', data);

    // Simulate API call
    setTimeout(() => {
        // Show success state
        button.innerHTML = '<span>✓ Success!</span>';
        button.style.background = 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';

        setTimeout(() => {
            closeLeadModal();
            event.target.reset();

            // Reset button
            button.disabled = false;
            button.innerHTML = originalText;
            button.style.opacity = '1';
            button.style.background = '';

            // Show success notification
            showCustomNotification('Thank you!', 'We\'ll be in touch with your free training access shortly.', 'success');
        }, 1500);
    }, 1500);
}

// Custom Notification System
function showCustomNotification(title, message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">${type === 'success' ? '✓' : 'ℹ'}</div>
        <div>
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 1.25rem;
        max-width: 400px;
        z-index: 3000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.5s ease;
        display: flex;
        gap: 1rem;
        align-items: center;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(450px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(450px);
            opacity: 0;
        }
    }

    .custom-notification {
        color: white;
    }

    .notification-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        flex-shrink: 0;
    }

    .notification-title {
        font-weight: 700;
        font-size: 1rem;
        margin-bottom: 0.25rem;
    }

    .notification-message {
        font-size: 0.875rem;
        color: #b4b4c8;
        line-height: 1.5;
    }
`;
document.head.appendChild(style);

// Auto-popup removed - modal only opens when user clicks button

// Notification Popup functionality - Male names (27/30 = 90%), International cities
const notifications = [
    // USA - 18 names (60%)
    { name: "Marcus from Dallas", message: "just got his first payout", initial: "M" },
    { name: "Brandon from Phoenix", message: "just started the strategy", initial: "B" },
    { name: "Tyler from Miami", message: "just got access", initial: "T" },
    { name: "Derek from Atlanta", message: "just joined the program", initial: "D" },
    { name: "Justin from Boston", message: "just got verified results", initial: "J" },
    { name: "Ryan from Chicago", message: "just got his payout", initial: "R" },
    { name: "Josh from Houston", message: "just started trading", initial: "J" },
    { name: "Matt from Portland", message: "just got access to the strategy", initial: "M" },
    { name: "Kyle from Nashville", message: "just got his first win", initial: "K" },
    { name: "Jake from Charlotte", message: "just got verified", initial: "J" },
    { name: "Ethan from Vegas", message: "just got access", initial: "E" },
    { name: "Blake from Denver", message: "just started the course", initial: "B" },
    { name: "Trevor from Seattle", message: "just got his payout", initial: "T" },
    { name: "Mason from San Diego", message: "just got access", initial: "M" },
    { name: "Logan from Austin", message: "just started trading", initial: "L" },
    { name: "Caleb from Philadelphia", message: "just got his first payout", initial: "C" },
    { name: "Dylan from Tampa", message: "just signed up", initial: "D" },
    { name: "Hunter from Orlando", message: "just got verified", initial: "H" },

    // UK - 3 names (10%)
    { name: "Oliver from London", message: "just got his first payout", initial: "O" },
    { name: "James from Manchester", message: "just started trading", initial: "J" },
    { name: "Harry from Birmingham", message: "just got access", initial: "H" },

    // Canada - 2 names (7%)
    { name: "Liam from Toronto", message: "just joined the program", initial: "L" },
    { name: "Noah from Vancouver", message: "just got verified", initial: "N" },

    // Australia - 2 names (7%)
    { name: "Jack from Sydney", message: "just started the strategy", initial: "J" },
    { name: "Connor from Melbourne", message: "just got his payout", initial: "C" },

    // Singapore - 1 name (3%)
    { name: "Wei from Singapore", message: "just got access", initial: "W" },

    // Germany - 1 name (3%)
    { name: "Leon from Berlin", message: "just started trading", initial: "L" },

    // Female names (3/30 = 10%) - USA, UK, Canada
    { name: "Ashley from LA", message: "just got her first payout", initial: "A" },
    { name: "Emily from London", message: "just started the program", initial: "E" },
    { name: "Sophie from Toronto", message: "just got verified", initial: "S" }
];

// Shuffle array function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Randomize notifications on page load
let shuffledNotifications = shuffleArray(notifications);
let currentNotificationIndex = 0;

// Generate random time - recent only for urgency/FOMO
function getRandomTime() {
    const times = [
        "just now", "1 minute ago", "2 minutes ago", "3 minutes ago",
        "5 minutes ago", "7 minutes ago", "9 minutes ago", "12 minutes ago", "15 minutes ago"
    ];
    return times[Math.floor(Math.random() * times.length)];
}

function showNotification() {
    const popup = document.getElementById('notificationPopup');
    const notification = shuffledNotifications[currentNotificationIndex];

    // Update notification content with random time
    popup.querySelector('.notification-avatar span').textContent = notification.initial;
    popup.querySelector('.notification-text p').innerHTML = `<strong>${notification.name}</strong> ${notification.message}`;
    popup.querySelector('.notification-time').textContent = getRandomTime();

    // Show notification with animation
    popup.classList.add('show');

    // Hide after 6 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 6000);

    // Move to next notification, reshuffle when done
    currentNotificationIndex++;
    if (currentNotificationIndex >= shuffledNotifications.length) {
        currentNotificationIndex = 0;
        shuffledNotifications = shuffleArray(notifications);
    }

    // Schedule next notification with random delay
    scheduleNextNotification();
}

// Random delay between notifications (12-25 seconds)
function getRandomDelay() {
    return Math.floor(Math.random() * (25000 - 12000 + 1)) + 12000;
}

function scheduleNextNotification() {
    setTimeout(showNotification, getRandomDelay());
}

// Show first notification after random initial delay (3-6 seconds)
setTimeout(showNotification, Math.floor(Math.random() * 3000) + 3000);

// Close notification when clicked
document.getElementById('notificationPopup').addEventListener('click', function() {
    this.classList.remove('show');
});

// Add hover effects to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            left: ${x}px;
            top: ${y}px;
        `;

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Cursor follow effect for cards
document.querySelectorAll('.feature-card, .result-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Engagement tracking removed - modal only opens on button click

// Make modal functions globally accessible
window.openLeadModal = openLeadModal;
window.closeLeadModal = closeLeadModal;

console.log('🚀 FuturesHive landing page loaded successfully!');
console.log('✅ openLeadModal is available globally:', typeof window.openLeadModal === 'function');
console.log('✅ closeLeadModal is available globally:', typeof window.closeLeadModal === 'function');
