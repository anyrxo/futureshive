// Hexagon Animation System
(function() {
    'use strict';

    // Create hexagon grid
    function createHexagonGrid() {
        const container = document.createElement('div');
        container.className = 'hexagon-container';

        const grid = document.createElement('div');
        grid.className = 'hexagon-grid';

        const hexWidth = 100;
        const hexHeight = 115;
        const horizontalSpacing = 85;
        const verticalSpacing = 100;

        const cols = Math.ceil(window.innerWidth / horizontalSpacing) + 2;
        const rows = Math.ceil(window.innerHeight / verticalSpacing) + 2;

        const hexagons = [];

        // Create hexagons
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const hex = document.createElement('div');
                hex.className = 'hexagon';

                const offsetX = (row % 2) * (horizontalSpacing / 2);
                const x = col * horizontalSpacing + offsetX;
                const y = row * verticalSpacing;

                hex.style.left = x + 'px';
                hex.style.top = y + 'px';
                hex.style.animationDelay = (Math.random() * 4) + 's';

                grid.appendChild(hex);
                hexagons.push({ element: hex, x, y });
            }
        }

        container.appendChild(grid);

        // Create electric connections
        createElectricConnections(grid, hexagons);

        // Create energy particles
        createEnergyParticles(grid, 15);

        // Create lightning bolts
        createLightningBolts(grid, 5);

        // Create energy waves
        createEnergyWaves(grid, 3);

        // Insert at beginning of body
        document.body.insertBefore(container, document.body.firstChild);
    }

    // Create electric connections between nearby hexagons
    function createElectricConnections(grid, hexagons) {
        const maxDistance = 150;
        const connectionCount = Math.min(hexagons.length * 2, 50);

        for (let i = 0; i < connectionCount; i++) {
            const hex1 = hexagons[Math.floor(Math.random() * hexagons.length)];

            // Find nearby hexagons
            const nearbyHexes = hexagons.filter(hex2 => {
                if (hex1 === hex2) return false;
                const dx = hex2.x - hex1.x;
                const dy = hex2.y - hex1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < maxDistance;
            });

            if (nearbyHexes.length > 0) {
                const hex2 = nearbyHexes[Math.floor(Math.random() * nearbyHexes.length)];

                const connection = document.createElement('div');
                connection.className = 'electric-connection';

                const dx = hex2.x - hex1.x;
                const dy = hex2.y - hex1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                connection.style.left = (hex1.x + 50) + 'px';
                connection.style.top = (hex1.y + 57) + 'px';
                connection.style.width = distance + 'px';
                connection.style.transform = `rotate(${angle}deg)`;
                connection.style.animationDelay = (Math.random() * 3) + 's';

                grid.appendChild(connection);

                // Add sparks along the connection
                if (Math.random() > 0.5) {
                    const spark = document.createElement('div');
                    spark.className = 'spark';
                    spark.style.left = (hex1.x + 50) + 'px';
                    spark.style.top = (hex1.y + 57) + 'px';
                    spark.style.width = distance + 'px';
                    spark.style.transform = `rotate(${angle}deg)`;
                    spark.style.animationDelay = (Math.random() * 2) + 's';
                    grid.appendChild(spark);
                }
            }
        }
    }

    // Create floating energy particles
    function createEnergyParticles(grid, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'energy-particle';

            particle.style.left = (Math.random() * 100) + '%';
            particle.style.top = (Math.random() * 100) + '%';
            particle.style.animationDelay = (Math.random() * 8) + 's';
            particle.style.animationDuration = (6 + Math.random() * 4) + 's';

            grid.appendChild(particle);
        }
    }

    // Create lightning bolts
    function createLightningBolts(grid, count) {
        for (let i = 0; i < count; i++) {
            const bolt = document.createElement('div');
            bolt.className = 'lightning-bolt';

            bolt.style.left = (Math.random() * 100) + '%';
            bolt.style.top = (Math.random() * 80) + '%';
            bolt.style.animationDelay = (Math.random() * 5) + 's';
            bolt.style.transform = `rotate(${-30 + Math.random() * 60}deg)`;

            grid.appendChild(bolt);
        }
    }

    // Create energy waves
    function createEnergyWaves(grid, count) {
        for (let i = 0; i < count; i++) {
            const wave = document.createElement('div');
            wave.className = 'energy-wave';

            wave.style.left = (20 + Math.random() * 60) + '%';
            wave.style.top = (20 + Math.random() * 60) + '%';
            wave.style.animationDelay = (i * 1.5) + 's';

            grid.appendChild(wave);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createHexagonGrid);
    } else {
        createHexagonGrid();
    }
})();
