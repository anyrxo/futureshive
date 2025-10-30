// Enhanced Internal Linking Structure
// Automatically creates contextual internal links for better SEO and user experience

(function() {
    'use strict';

    const config = {
        domain: 'https://futureshive.vercel.app',
        keywords: {
            'trading strategy': {
                url: '/',
                title: 'Learn our proven trading strategy',
                priority: 1
            },
            'futures trading': {
                url: '/',
                title: 'Discover futures trading education',
                priority: 1
            },
            'day trading': {
                url: '/',
                title: 'Master day trading techniques',
                priority: 2
            },
            'privacy policy': {
                url: '/privacy-policy.html',
                title: 'Read our privacy policy',
                priority: 3
            },
            'refund policy': {
                url: '/refund-policy.html',
                title: 'View our refund policy',
                priority: 3
            },
            'trading education': {
                url: '/',
                title: 'Quality trading education',
                priority: 2
            },
            'profitable trading': {
                url: '/',
                title: 'Learn profitable trading methods',
                priority: 2
            }
        },
        maxLinksPerPage: 10,
        excludeSelectors: ['nav', 'footer', '.modal', 'button', 'a'],
        caseSensitive: false
    };

    // Add internal links to content
    function addInternalLinks() {
        const contentAreas = document.querySelectorAll('p, h1, h2, h3, h4, li');
        let linksAdded = 0;

        contentAreas.forEach(element => {
            // Skip if already has links or is in excluded areas
            if (element.querySelector('a') || isExcluded(element)) {
                return;
            }

            const text = element.innerHTML;
            let newText = text;

            // Sort keywords by priority
            const sortedKeywords = Object.keys(config.keywords).sort((a, b) => {
                return config.keywords[a].priority - config.keywords[b].priority;
            });

            // Replace keywords with links
            sortedKeywords.forEach(keyword => {
                if (linksAdded >= config.maxLinksPerPage) return;

                const linkData = config.keywords[keyword];
                const regex = new RegExp(`\\b${keyword}\\b`, config.caseSensitive ? 'g' : 'gi');

                if (regex.test(newText) && !newText.includes(`href="${linkData.url}"`)) {
                    newText = newText.replace(regex, (match) => {
                        linksAdded++;
                        return `<a href="${linkData.url}" title="${linkData.title}" class="internal-link">${match}</a>`;
                    });
                }
            });

            if (newText !== text) {
                element.innerHTML = newText;
            }
        });

        console.log(`Internal Linking: Added ${linksAdded} contextual links`);
    }

    // Check if element is in excluded area
    function isExcluded(element) {
        return config.excludeSelectors.some(selector => {
            return element.closest(selector) !== null;
        });
    }

    // Create breadcrumb navigation
    function createBreadcrumbs() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(s => s);

        if (segments.length === 0) return; // Home page, no breadcrumbs needed

        const breadcrumbContainer = document.createElement('nav');
        breadcrumbContainer.className = 'breadcrumbs';
        breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb');

        const ol = document.createElement('ol');
        ol.className = 'breadcrumb-list';

        // Home link
        const homeLi = document.createElement('li');
        homeLi.className = 'breadcrumb-item';
        homeLi.innerHTML = `<a href="/" title="Home">Home</a>`;
        ol.appendChild(homeLi);

        // Build path segments
        let currentPath = '';
        segments.forEach((segment, index) => {
            currentPath += '/' + segment;
            const li = document.createElement('li');
            li.className = 'breadcrumb-item';

            const title = segment.replace(/-/g, ' ').replace('.html', '');
            const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);

            if (index === segments.length - 1) {
                // Current page - no link
                li.innerHTML = `<span aria-current="page">${capitalizedTitle}</span>`;
            } else {
                li.innerHTML = `<a href="${currentPath}" title="${capitalizedTitle}">${capitalizedTitle}</a>`;
            }

            ol.appendChild(li);
        });

        breadcrumbContainer.appendChild(ol);

        // Insert breadcrumbs after navbar
        const navbar = document.querySelector('nav');
        if (navbar && navbar.nextSibling) {
            navbar.parentNode.insertBefore(breadcrumbContainer, navbar.nextSibling);
        }
    }

    // Create related content links
    function createRelatedLinks() {
        const relatedPages = [
            { url: '/privacy-policy.html', title: 'Privacy Policy' },
            { url: '/refund-policy.html', title: 'Refund Policy' }
        ];

        const currentPath = window.location.pathname;

        // Filter out current page
        const related = relatedPages.filter(page => page.url !== currentPath);

        if (related.length === 0) return;

        const relatedContainer = document.createElement('aside');
        relatedContainer.className = 'related-links';
        relatedContainer.innerHTML = '<h3>Related Pages</h3>';

        const ul = document.createElement('ul');
        related.forEach(page => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${page.url}" title="${page.title}" rel="related">${page.title}</a>`;
            ul.appendChild(li);
        });

        relatedContainer.appendChild(ul);

        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(relatedContainer, footer);
        }
    }

    // Create topic clusters (pillar page linking)
    function createTopicClusters() {
        const pillarPage = {
            url: '/',
            title: 'FuturesHive Trading Strategy',
            topics: [
                'trading strategy',
                'futures trading',
                'day trading',
                'trading education',
                'profitable trading'
            ]
        };

        const currentPath = window.location.pathname;

        // If on pillar page, link to cluster pages
        if (currentPath === '/' || currentPath === '/index.html') {
            // Add links to related topics in footer
            const footer = document.querySelector('footer .footer-content');
            if (footer) {
                const topicLinks = document.createElement('div');
                topicLinks.className = 'topic-cluster';
                topicLinks.innerHTML = '<h4>Trading Topics</h4><ul>';

                pillarPage.topics.forEach(topic => {
                    if (config.keywords[topic]) {
                        topicLinks.innerHTML += `<li><a href="${config.keywords[topic].url}" title="${config.keywords[topic].title}">${topic}</a></li>`;
                    }
                });

                topicLinks.innerHTML += '</ul>';
                footer.appendChild(topicLinks);
            }
        }
    }

    // Add structured data for breadcrumbs
    function addBreadcrumbSchema() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(s => s);

        if (segments.length === 0) return;

        const breadcrumbList = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": []
        };

        // Add home
        breadcrumbList.itemListElement.push({
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": config.domain
        });

        // Add segments
        let currentPath = config.domain;
        segments.forEach((segment, index) => {
            currentPath += '/' + segment;
            const title = segment.replace(/-/g, ' ').replace('.html', '');
            const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);

            breadcrumbList.itemListElement.push({
                "@type": "ListItem",
                "position": index + 2,
                "name": capitalizedTitle,
                "item": currentPath
            });
        });

        // Add schema to head
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(breadcrumbList);
        document.head.appendChild(script);
    }

    // Track internal link clicks
    function trackInternalLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href && href.startsWith('/')) {
                console.log('Internal link clicked:', href);

                // Send to analytics
                if (typeof gtag === 'function') {
                    gtag('event', 'internal_link_click', {
                        'event_category': 'Navigation',
                        'event_label': href,
                        'transport_type': 'beacon'
                    });
                }
            }
        });
    }

    // Add CSS for internal links
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .internal-link {
                color: #1e90ff;
                text-decoration: underline;
                text-decoration-style: dotted;
                transition: color 0.2s ease;
            }

            .internal-link:hover {
                color: #4169e1;
                text-decoration-style: solid;
            }

            .breadcrumbs {
                padding: 1rem 0;
                background: rgba(255, 255, 255, 0.05);
                margin-top: 60px;
            }

            .breadcrumb-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                list-style: none;
                padding: 0;
                margin: 0;
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 2rem;
            }

            .breadcrumb-item {
                display: flex;
                align-items: center;
            }

            .breadcrumb-item:not(:last-child)::after {
                content: '›';
                margin-left: 0.5rem;
                color: rgba(255, 255, 255, 0.5);
            }

            .breadcrumb-item a {
                color: #1e90ff;
                text-decoration: none;
                font-size: 0.9rem;
            }

            .breadcrumb-item a:hover {
                text-decoration: underline;
            }

            .breadcrumb-item span {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9rem;
            }

            .related-links {
                padding: 2rem;
                margin: 2rem auto;
                max-width: 1200px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }

            .related-links h3 {
                color: #1e90ff;
                margin-bottom: 1rem;
            }

            .related-links ul {
                list-style: none;
                padding: 0;
            }

            .related-links li {
                margin-bottom: 0.5rem;
            }

            .related-links a {
                color: #fff;
                text-decoration: none;
                transition: color 0.2s;
            }

            .related-links a:hover {
                color: #1e90ff;
            }

            .topic-cluster {
                margin-top: 2rem;
            }

            .topic-cluster h4 {
                color: #1e90ff;
                margin-bottom: 1rem;
            }

            .topic-cluster ul {
                list-style: none;
                padding: 0;
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .topic-cluster a {
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                padding: 0.5rem 1rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                transition: all 0.2s;
            }

            .topic-cluster a:hover {
                background: rgba(30, 144, 255, 0.2);
                color: #1e90ff;
            }

            @media (max-width: 768px) {
                .breadcrumbs {
                    padding: 0.5rem 0;
                }

                .breadcrumb-list {
                    padding: 0 1rem;
                    font-size: 0.85rem;
                }

                .related-links {
                    padding: 1rem;
                    margin: 1rem;
                }

                .topic-cluster ul {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Public API
    window.InternalLinking = {
        add: addInternalLinks,
        createBreadcrumbs: createBreadcrumbs,
        createRelated: createRelatedLinks,
        config: config
    };

    // Initialize
    function init() {
        addStyles();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                addInternalLinks();
                createBreadcrumbs();
                createRelatedLinks();
                createTopicClusters();
                addBreadcrumbSchema();
                trackInternalLinks();
            });
        } else {
            addInternalLinks();
            createBreadcrumbs();
            createRelatedLinks();
            createTopicClusters();
            addBreadcrumbSchema();
            trackInternalLinks();
        }

        console.log('Enhanced Internal Linking initialized');
    }

    init();

})();
