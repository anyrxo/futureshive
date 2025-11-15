// Dynamic XML Sitemap Generator
// Auto-generates and updates sitemap.xml with priority, frequency, and last modified dates

(function() {
    'use strict';

    const config = {
        domain: 'https://futureshive.com',
        defaultPriority: 0.5,
        defaultChangeFreq: 'weekly',
        pages: [
            {
                url: '/',
                priority: 1.0,
                changefreq: 'daily',
                lastmod: new Date().toISOString().split('T')[0]
            },
            {
                url: '/privacy-policy.html',
                priority: 0.3,
                changefreq: 'monthly',
                lastmod: '2025-01-15'
            },
            {
                url: '/refund-policy.html',
                priority: 0.3,
                changefreq: 'monthly',
                lastmod: '2025-01-15'
            }
        ]
    };

    // Generate XML sitemap
    function generateSitemap() {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
        xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n';
        xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
        xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
        xml += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n\n';

        config.pages.forEach(page => {
            xml += '  <url>\n';
            xml += `    <loc>${config.domain}${page.url}</loc>\n`;
            xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;

            // Add image sitemap if images exist
            if (page.images && page.images.length > 0) {
                page.images.forEach(image => {
                    xml += '    <image:image>\n';
                    xml += `      <image:loc>${config.domain}${image.url}</image:loc>\n`;
                    xml += `      <image:title>${image.title}</image:title>\n`;
                    xml += `      <image:caption>${image.caption}</image:caption>\n`;
                    xml += '    </image:image>\n';
                });
            }

            // Add video sitemap if videos exist
            if (page.videos && page.videos.length > 0) {
                page.videos.forEach(video => {
                    xml += '    <video:video>\n';
                    xml += `      <video:thumbnail_loc>${config.domain}${video.thumbnail}</video:thumbnail_loc>\n`;
                    xml += `      <video:title>${video.title}</video:title>\n`;
                    xml += `      <video:description>${video.description}</video:description>\n`;
                    xml += `      <video:content_loc>${config.domain}${video.url}</video:content_loc>\n`;
                    xml += `      <video:duration>${video.duration}</video:duration>\n`;
                    xml += '    </video:video>\n';
                });
            }

            // Add alternate language versions
            if (page.alternates && page.alternates.length > 0) {
                page.alternates.forEach(alt => {
                    xml += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${config.domain}${alt.url}" />\n`;
                });
            }

            xml += '  </url>\n\n';
        });

        xml += '</urlset>';

        return xml;
    }

    // Generate sitemap index for large sites
    function generateSitemapIndex(sitemaps) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';

        sitemaps.forEach(sitemap => {
            xml += '  <sitemap>\n';
            xml += `    <loc>${config.domain}${sitemap.url}</loc>\n`;
            xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
            xml += '  </sitemap>\n\n';
        });

        xml += '</sitemapindex>';

        return xml;
    }

    // Auto-discover pages by crawling the site
    function discoverPages() {
        const discovered = [];
        const links = document.querySelectorAll('a[href]');

        links.forEach(link => {
            const href = link.getAttribute('href');

            // Only include internal links
            if (href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#')) {
                const url = href.startsWith('/') ? href : '/' + href;

                // Avoid duplicates
                if (!discovered.find(p => p.url === url)) {
                    discovered.push({
                        url: url,
                        priority: 0.5,
                        changefreq: 'weekly',
                        lastmod: new Date().toISOString().split('T')[0]
                    });
                }
            }
        });

        return discovered;
    }

    // Update sitemap with newly discovered pages
    function updateSitemap() {
        const discoveredPages = discoverPages();

        // Merge with existing pages
        discoveredPages.forEach(discovered => {
            const exists = config.pages.find(p => p.url === discovered.url);
            if (!exists) {
                config.pages.push(discovered);
            }
        });

        console.log(`Sitemap: Discovered ${config.pages.length} total pages`);
    }

    // Send sitemap to search engines
    function submitSitemap() {
        const sitemapURL = `${config.domain}/sitemap.xml`;

        const searchEngines = [
            `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapURL)}`,
            `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapURL)}`,
            `https://submissions.ask.com/ping?sitemap=${encodeURIComponent(sitemapURL)}`
        ];

        searchEngines.forEach(endpoint => {
            fetch(endpoint, { method: 'GET' })
                .then(response => {
                    if (response.ok) {
                        console.log(`✓ Sitemap submitted to ${endpoint}`);
                    }
                })
                .catch(error => {
                    console.error(`✗ Sitemap submission failed for ${endpoint}:`, error);
                });
        });
    }

    // Export sitemap for download
    function exportSitemap() {
        const xml = generateSitemap();
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('Sitemap exported successfully');
    }

    // Generate HTML sitemap for users
    function generateHTMLSitemap() {
        let html = '<div class="sitemap">\n';
        html += '  <h1>Site Map</h1>\n';
        html += '  <ul>\n';

        config.pages.forEach(page => {
            const title = page.url === '/' ? 'Home' : page.url.replace(/\.html$/, '').replace(/\//g, '').replace(/-/g, ' ');
            html += `    <li><a href="${page.url}">${title}</a></li>\n`;
        });

        html += '  </ul>\n';
        html += '</div>';

        return html;
    }

    // Monitor page changes and update sitemap
    function monitorChanges() {
        // Track when content changes
        const observer = new MutationObserver((mutations) => {
            console.log('Sitemap: Content changed, updating...');
            updateSitemap();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    // Public API
    window.SitemapGenerator = {
        generate: generateSitemap,
        generateIndex: generateSitemapIndex,
        update: updateSitemap,
        submit: submitSitemap,
        export: exportSitemap,
        generateHTML: generateHTMLSitemap,
        config: config
    };

    // Initialize
    function init() {
        updateSitemap();
        monitorChanges();

        // Auto-submit sitemap once per day
        const lastSubmit = localStorage.getItem('sitemap_last_submit');
        const now = Date.now();

        if (!lastSubmit || (now - parseInt(lastSubmit)) > 86400000) {
            submitSitemap();
            localStorage.setItem('sitemap_last_submit', now.toString());
        }

        console.log('Dynamic Sitemap Generator initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// Usage:
// SitemapGenerator.export(); // Download sitemap.xml
// SitemapGenerator.submit(); // Submit to search engines
// console.log(SitemapGenerator.generateHTML()); // Get HTML sitemap
