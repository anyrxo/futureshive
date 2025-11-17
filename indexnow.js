// IndexNow - Instant Search Engine Indexing
// Submits URLs to Bing, Yandex, and other IndexNow-enabled search engines instantly

(function() {
    'use strict';

    const config = {
        host: 'futureshive.com',
        key: '840c3166728346ed81e4d8ecb16e98a1', // Generated via Bing Webmaster Tools
        keyLocation: 'https://futureshive.com/840c3166728346ed81e4d8ecb16e98a1.txt',
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
            `https://${config.host}/blog/`,
            `https://${config.host}/privacy-policy`,
            `https://${config.host}/refund-policy`,
            // Blog posts - all 36 posts
            `https://${config.host}/blog/es-nq-futures-trading-guide-2025`,
            `https://${config.host}/blog/micro-emini-futures-mes-mnq-guide-2025`,
            `https://${config.host}/blog/how-to-start-futures-trading-beginners-2025`,
            `https://${config.host}/blog/best-futures-brokers-day-traders-2025`,
            `https://${config.host}/blog/futures-trading-strategies-indicators-2025`,
            `https://${config.host}/blog/vwap-trading-strategy-futures-2025`,
            `https://${config.host}/blog/moving-average-strategies-futures-2025`,
            `https://${config.host}/blog/macd-trading-strategy-futures-2025`,
            `https://${config.host}/blog/rsi-divergence-trading-strategy-2025`,
            `https://${config.host}/blog/support-resistance-trading-strategy-2025`,
            `https://${config.host}/blog/fibonacci-retracement-trading-strategy-2025`,
            `https://${config.host}/blog/candlestick-patterns-trading-guide-2025`,
            `https://${config.host}/blog/volume-profile-trading-strategy-2025`,
            `https://${config.host}/blog/order-flow-trading-complete-guide-2025`,
            `https://${config.host}/blog/footprint-charts-complete-guide-2025`,
            `https://${config.host}/blog/trading-psychology-overcome-fear-greed-2025`,
            `https://${config.host}/blog/tradingview-vs-quanttower-2025-comparison`,
            `https://${config.host}/blog/best-prop-firms-day-traders-2025`,
            `https://${config.host}/blog/instant-funding-prop-firms-no-evaluation`,
            `https://${config.host}/blog/how-to-pass-prop-firm-challenge`,
            `https://${config.host}/blog/what-is-prop-firm-complete-guide`,
            `https://${config.host}/blog/cheapest-prop-firms-budget-guide`,
            `https://${config.host}/blog/how-to-choose-prop-firm-guide`,
            `https://${config.host}/blog/prop-firm-profit-split-comparison`,
            `https://${config.host}/blog/ftmo-vs-apex-vs-topstep-comparison`,
            `https://${config.host}/blog/prop-firm-payout-withdrawal-guide`,
            `https://${config.host}/blog/failed-prop-firm-challenge-what-next`,
            `https://${config.host}/blog/best-prop-firms-for-scalping`,
            `https://${config.host}/blog/prop-firm-consistency-rule-minimum-trading-days`,
            `https://${config.host}/blog/prop-firm-scaling-plan-guide`,
            `https://${config.host}/blog/tjr-trader-profile-killtec-streetwear`,
            `https://${config.host}/blog/fabio-valentini-worlds-best-scalper-deepcharts`,
            `https://${config.host}/blog/andrea-cimi-youtube-trader-deepcharts-morpheus`,
            `https://${config.host}/blog/anyro-futureshive-multidisciplinary-entrepreneur`,
            `https://${config.host}/blog/craig-percoco-inevitrade-military-veteran-trader`,
            `https://${config.host}/blog/pb-blake-pb-trading-nq-futures-specialist`
        ];

        const submitted = localStorage.getItem('indexnow_sitemap_submitted_v2');

        if (!submitted) {
            // Split into smaller batches (Bing prefers max 10000 URLs but smaller batches work better)
            const batchSize = 100;
            for (let i = 0; i < urls.length; i += batchSize) {
                const batch = urls.slice(i, i + batchSize);
                setTimeout(() => {
                    submitBatch(batch);
                }, i * 100); // Stagger submissions
            }
            localStorage.setItem('indexnow_sitemap_submitted_v2', Date.now().toString());
            console.log(`IndexNow: Submitted ${urls.length} URLs in batches`);
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

// Manual API submission example:
// POST to https://api.indexnow.org/IndexNow
// {
//   "host": "futureshive.com",
//   "key": "840c3166728346ed81e4d8ecb16e98a1",
//   "keyLocation": "https://futureshive.com/840c3166728346ed81e4d8ecb16e98a1.txt",
//   "urlList": ["https://futureshive.com/"]
// }
