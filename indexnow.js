// IndexNow - Instant Search Engine Indexing
// Submits URLs to Bing, Yandex, and other IndexNow-enabled search engines instantly

(function() {
    'use strict';

    const config = {
        host: 'futureshive.com',
        key: '4f8b2e9a1c3d6e7f0a9b8c7d6e5f4a3b', // Generate your own at bing.com/indexnow
        keyLocation: 'https://futureshive.com/4f8b2e9a1c3d6e7f0a9b8c7d6e5f4a3b.txt',
        endpoints: [
            'https://api.indexnow.org/IndexNow',
            'https://www.bing.com/IndexNow',
            'https://yandex.com/indexnow'
        ]
    };

    // Submit single URL to IndexNow
    function submitURL(url) {
        const payload = {
            host: config.host,
            key: config.key,
            keyLocation: config.keyLocation,
            urlList: [url]
        };

        config.endpoints.forEach(endpoint => {
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    console.log(`✓ IndexNow: Successfully submitted to ${endpoint}`);
                } else {
                    console.warn(`✗ IndexNow: Failed to submit to ${endpoint} (${response.status})`);
                }
            })
            .catch(error => {
                console.error(`✗ IndexNow: Error submitting to ${endpoint}:`, error);
            });
        });
    }

    // Submit multiple URLs in batch
    function submitBatch(urls) {
        const payload = {
            host: config.host,
            key: config.key,
            keyLocation: config.keyLocation,
            urlList: urls
        };

        config.endpoints.forEach(endpoint => {
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    console.log(`✓ IndexNow: Batch submitted ${urls.length} URLs to ${endpoint}`);
                } else {
                    console.warn(`✗ IndexNow: Batch failed for ${endpoint} (${response.status})`);
                }
            })
            .catch(error => {
                console.error(`✗ IndexNow: Batch error for ${endpoint}:`, error);
            });
        });
    }

    // Auto-submit current page on load
    function autoSubmit() {
        const currentURL = window.location.href;

        // Only submit if not already submitted recently
        const lastSubmit = localStorage.getItem('indexnow_last_submit');
        const now = Date.now();

        if (!lastSubmit || (now - parseInt(lastSubmit)) > 86400000) { // 24 hours
            submitURL(currentURL);
            localStorage.setItem('indexnow_last_submit', now.toString());
            console.log('IndexNow: Auto-submitted current page');
        } else {
            console.log('IndexNow: Skipping auto-submit (recent submission)');
        }
    }

    // Submit all important pages on first visit
    function submitSitemap() {
        const urls = [
            `https://${config.host}/`,
            `https://${config.host}/privacy-policy.html`,
            `https://${config.host}/refund-policy.html`
        ];

        const submitted = localStorage.getItem('indexnow_sitemap_submitted');

        if (!submitted) {
            submitBatch(urls);
            localStorage.setItem('indexnow_sitemap_submitted', 'true');
            console.log('IndexNow: Submitted full sitemap');
        }
    }

    // Track user interactions and submit updated pages
    function trackInteractions() {
        // Submit when user engages with content
        let engaged = false;

        const engagementEvents = ['click', 'scroll', 'touchstart'];

        engagementEvents.forEach(eventType => {
            document.addEventListener(eventType, () => {
                if (!engaged) {
                    engaged = true;
                    console.log('IndexNow: User engaged - prioritizing indexing');
                    submitURL(window.location.href);
                }
            }, { once: true });
        });
    }

    // Monitor for page changes (SPA support)
    function monitorPageChanges() {
        let lastPath = window.location.pathname;

        setInterval(() => {
            if (window.location.pathname !== lastPath) {
                lastPath = window.location.pathname;
                submitURL(window.location.href);
                console.log('IndexNow: Page change detected, submitted new URL');
            }
        }, 1000);
    }

    // Public API
    window.IndexNow = {
        submit: submitURL,
        submitBatch: submitBatch,
        config: config
    };

    // Initialize
    function init() {
        // Wait for page to be interactive
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                autoSubmit();
                submitSitemap();
                trackInteractions();
                monitorPageChanges();
            });
        } else {
            autoSubmit();
            submitSitemap();
            trackInteractions();
            monitorPageChanges();
        }
    }

    init();

})();

// Usage examples:
// IndexNow.submit('https://futureshive.com/new-page.html');
// IndexNow.submitBatch(['https://futureshive.com/page1.html', 'https://futureshive.com/page2.html']);
