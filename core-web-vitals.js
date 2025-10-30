// Core Web Vitals Optimization Script
// Monitors and optimizes LCP, FID, CLS metrics

(function() {
    'use strict';

    // 1. Largest Contentful Paint (LCP) Optimization
    function optimizeLCP() {
        // Preload critical images
        const hero = document.querySelector('.hero');
        if (hero) {
            const bgImage = window.getComputedStyle(hero).backgroundImage;
            if (bgImage && bgImage !== 'none') {
                const imageUrl = bgImage.slice(5, -2);
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = imageUrl;
                document.head.appendChild(link);
            }
        }

        // Lazy load non-critical images
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        } else {
            // Fallback for browsers without native lazy loading
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js';
            document.body.appendChild(script);
        }
    }

    // 2. First Input Delay (FID) Optimization
    function optimizeFID() {
        // Break up long tasks
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            const originalClick = button.onclick;
            button.onclick = function(e) {
                requestIdleCallback(() => {
                    if (originalClick) originalClick.call(this, e);
                }, { timeout: 50 });
            };
        });

        // Use passive event listeners for scrolling
        document.addEventListener('touchstart', function() {}, { passive: true });
        document.addEventListener('touchmove', function() {}, { passive: true });
        document.addEventListener('wheel', function() {}, { passive: true });
    }

    // 3. Cumulative Layout Shift (CLS) Optimization
    function optimizeCLS() {
        // Add aspect ratio containers for images
        const images = document.querySelectorAll('img:not([width]):not([height])');
        images.forEach(img => {
            if (img.naturalWidth && img.naturalHeight) {
                const aspectRatio = (img.naturalHeight / img.naturalWidth) * 100;
                img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
            }
        });

        // Reserve space for dynamic content
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.minHeight = '400px';
        });

        // Prevent font layout shifts
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                document.body.classList.add('fonts-loaded');
            });
        }
    }

    // 4. Web Vitals Tracking
    function trackWebVitals() {
        // Check if Web Vitals library is available
        if (typeof webVitals !== 'undefined') {
            webVitals.getCLS(sendToAnalytics);
            webVitals.getFID(sendToAnalytics);
            webVitals.getLCP(sendToAnalytics);
            webVitals.getFCP(sendToAnalytics);
            webVitals.getTTFB(sendToAnalytics);
        } else {
            // Manual tracking fallback
            if ('PerformanceObserver' in window) {
                // Track LCP
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    sendToAnalytics({
                        name: 'LCP',
                        value: lastEntry.renderTime || lastEntry.loadTime,
                        rating: lastEntry.renderTime < 2500 ? 'good' : lastEntry.renderTime < 4000 ? 'needs-improvement' : 'poor'
                    });
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                // Track FID
                const fidObserver = new PerformanceObserver((entryList) => {
                    const firstInput = entryList.getEntries()[0];
                    const fid = firstInput.processingStart - firstInput.startTime;
                    sendToAnalytics({
                        name: 'FID',
                        value: fid,
                        rating: fid < 100 ? 'good' : fid < 300 ? 'needs-improvement' : 'poor'
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });

                // Track CLS
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    sendToAnalytics({
                        name: 'CLS',
                        value: clsValue,
                        rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor'
                    });
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            }
        }
    }

    // Send metrics to analytics
    function sendToAnalytics(metric) {
        console.log('Web Vital:', metric);

        // Send to Google Analytics if available
        if (typeof gtag === 'function') {
            gtag('event', metric.name, {
                event_category: 'Web Vitals',
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                event_label: metric.rating,
                non_interaction: true
            });
        }

        // Send to custom endpoint
        if (navigator.sendBeacon) {
            const body = JSON.stringify(metric);
            navigator.sendBeacon('/api/analytics', body);
        }
    }

    // 5. Resource Hints Optimization
    function addResourceHints() {
        // Prefetch next likely page
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = '/privacy-policy.html';
        document.head.appendChild(link);

        // Preconnect to critical third parties
        const preconnects = [
            'https://www.googletagmanager.com',
            'https://www.google-analytics.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        preconnects.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    // 6. Critical CSS Inlining
    function handleCriticalCSS() {
        // Move non-critical CSS to load asynchronously
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach(link => {
            if (!link.hasAttribute('data-critical')) {
                link.media = 'print';
                link.onload = function() {
                    this.media = 'all';
                };
            }
        });
    }

    // 7. JavaScript Performance
    function optimizeJavaScript() {
        // Defer non-critical scripts
        const scripts = document.querySelectorAll('script[src]:not([async]):not([defer])');
        scripts.forEach(script => {
            if (!script.hasAttribute('data-critical')) {
                script.defer = true;
            }
        });
    }

    // Initialize all optimizations
    function init() {
        // Run immediately
        optimizeCLS();
        addResourceHints();

        // Run on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                optimizeLCP();
                optimizeFID();
                trackWebVitals();
            });
        } else {
            optimizeLCP();
            optimizeFID();
            trackWebVitals();
        }

        // Run on window load
        window.addEventListener('load', () => {
            handleCriticalCSS();
            optimizeJavaScript();

            // Final CLS check after everything loads
            setTimeout(() => {
                optimizeCLS();
            }, 1000);
        });
    }

    // Start optimization
    init();

})();
