class MappingSystem {
    constructor() {
        this.map = null;
        this.userMarker = null;
        this.discoveryMarkers = [];
        this.communityMarkers = [];
        this.isMapInitialized = false;
        this.discoveries = [];
        this.filterOptions = {
            species: 'all',
            timeframe: 'all',
            user: 'all'
        };
        // Amsterdam coordinates
        this.baseLocation = { lat: 52.3676, lng: 4.9041 };
        this.amsterdamDistricts = this.initializeAmsterdamDistricts();
        console.log('MappingSystem initialized for Amsterdam');
    }

    initializeAmsterdamDistricts() {
        return [
            { name: 'Centrum', lat: 52.3702, lng: 4.8952, population: 0.15 },
            { name: 'Noord', lat: 52.3947, lng: 4.9073, population: 0.12 },
            { name: 'Oost', lat: 52.3676, lng: 4.9435, population: 0.18 },
            { name: 'Zuid', lat: 52.3518, lng: 4.8936, population: 0.16 },
            { name: 'West', lat: 52.3676, lng: 4.8355, population: 0.14 },
            { name: 'Nieuw-West', lat: 52.3448, lng: 4.8095, population: 0.13 },
            { name: 'Zuidoost', lat: 52.3196, lng: 4.9725, population: 0.12 },
            // Popular parks and nature areas
            { name: 'Vondelpark', lat: 52.3579, lng: 4.8686, population: 0.25 },
            { name: 'Amsterdamse Bos', lat: 52.3191, lng: 4.8129, population: 0.30 },
            { name: 'Westerpark', lat: 52.3889, lng: 4.8797, population: 0.20 },
            { name: 'Oosterpark', lat: 52.3591, lng: 4.9155, population: 0.22 },
            { name: 'Sarphatipark', lat: 52.3548, lng: 4.8976, population: 0.18 },
            { name: 'Beatrixpark', lat: 52.3379, lng: 4.8720, population: 0.20 },
            { name: 'Flevopark', lat: 52.3704, lng: 4.9464, population: 0.25 },
            // Canal areas (great for nature discoveries)
            { name: 'Canal Ring', lat: 52.3676, lng: 4.8883, population: 0.15 },
            { name: 'Jordaan', lat: 52.3759, lng: 4.8839, population: 0.12 },
            { name: 'De Pijp', lat: 52.3548, lng: 4.8976, population: 0.14 }
        ];
    }

    async getCurrentLocation() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.warn('Geolocation not supported, using Amsterdam center');
                resolve(this.baseLocation);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Geolocation success');
                    // Check if user is in Amsterdam area (within ~50km)
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    const distance = this.calculateDistance(
                        userLat, userLng, 
                        this.baseLocation.lat, this.baseLocation.lng
                    );
                    
                    if (distance < 50) {
                        // User is in Amsterdam area, use their location
                        resolve({
                            lat: userLat,
                            lng: userLng
                        });
                    } else {
                        // User is elsewhere, use Amsterdam center
                        console.log('User outside Amsterdam, using city center');
                        resolve(this.baseLocation);
                    }
                },
                (error) => {
                    console.warn('Geolocation failed, using Amsterdam center:', error);
                    resolve(this.baseLocation);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
            );
        });
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    async loadDiscoveries() {
        console.log('Loading Amsterdam discoveries...');
        this.discoveries = [];

        // Load user's own discoveries (place them around Amsterdam)
        const gameData = JSON.parse(localStorage.getItem('insectDetectionGame'));
        if (gameData && gameData.discoveredSpecies) {
            const userDiscoveries = gameData.discoveredSpecies.map((discovery, index) => {
                const randomDistrict = this.amsterdamDistricts[Math.floor(Math.random() * this.amsterdamDistricts.length)];
                return {
                    ...discovery,
                    lat: randomDistrict.lat + (Math.random() - 0.5) * 0.01, // ~500m radius
                    lng: randomDistrict.lng + (Math.random() - 0.5) * 0.01,
                    user: 'me',
                    username: 'You',
                    district: randomDistrict.name,
                    id: `user_${index}`
                };
            });
            this.discoveries.push(...userDiscoveries);
            console.log(`Loaded ${userDiscoveries.length} user discoveries in Amsterdam`);
        }

        // Generate many community discoveries across Amsterdam
        const communityDiscoveries = this.generateAmsterdamCommunityDiscoveries();
        this.discoveries.push(...communityDiscoveries);
        console.log(`Total Amsterdam discoveries: ${this.discoveries.length}`);
    }

    generateAmsterdamCommunityDiscoveries() {
        const communityDiscoveries = [];
        
        // Amsterdam-specific species (more realistic for the Netherlands)
        const dutchSpecies = [
            // Common Dutch insects
            { name: 'Butterfly', weight: 0.15, season: ['spring', 'summer'] },
            { name: 'Bee', weight: 0.20, season: ['spring', 'summer', 'autumn'] },
            { name: 'Beetle', weight: 0.12, season: ['spring', 'summer', 'autumn'] },
            { name: 'Spider', weight: 0.10, season: ['spring', 'summer', 'autumn'] },
            
            // Dutch flora
            { name: 'Rose', weight: 0.08, season: ['spring', 'summer'] },
            { name: 'Sunflower', weight: 0.06, season: ['summer'] },
            { name: 'Oak Leaf', weight: 0.15, season: ['spring', 'summer', 'autumn'] },
            { name: 'Pine Cone', weight: 0.08, season: ['autumn', 'winter'] },
            
            // Additional Amsterdam-specific finds
            { name: 'Dutch Elm', weight: 0.03, season: ['spring', 'summer', 'autumn'] },
            { name: 'Canal Duck', weight: 0.03, season: ['spring', 'summer', 'autumn', 'winter'] }
        ];

        // Dutch usernames for authenticity
        const dutchUsernames = [
            'NatuurLiefhebber', 'AmsterdamExplorer', 'ParkWanderer', 'BioDiversiteit', 
            'GrachtenGids', 'VondelParkFan', 'GroenAmsterdam', 'StadsNatuur',
            'CanalCrawler', 'DutchNaturalist', 'BosWandelaar', 'BloemVinder',
            'InsectenJager', 'StadsTuinier', 'EcoAmsterdam', 'WildlifeAdam',
            'NatuurFoto', 'GroeneVinger', 'ParkBioloog', 'FloraFauna020'
        ];

        const currentSeason = this.getCurrentSeason();
        const rarities = ['common', 'common', 'common', 'common', 'uncommon', 'uncommon', 'rare', 'epic'];

        // Generate 150 discoveries across Amsterdam (heavy population)
        for (let i = 0; i < 150; i++) {
            // Choose random district (parks have higher probability)
            const randomDistrict = this.getWeightedRandomDistrict();
            
            // Choose species based on season and location
            const availableSpecies = dutchSpecies.filter(s => 
                s.season.includes(currentSeason) || s.season.includes('all')
            );
            const species = this.getWeightedRandomSpecies(availableSpecies);
            
            // Generate realistic timestamp (last 30 days, more recent = higher probability)
            const daysAgo = Math.floor(Math.pow(Math.random(), 2) * 30); // Weighted towards recent
            const hoursAgo = Math.floor(Math.random() * 24);
            const timestamp = new Date(Date.now() - (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000);
            
            // Add some location variance based on district type
            const locationVariance = randomDistrict.name.includes('park') || randomDistrict.name.includes('Bos') ? 0.008 : 0.004;
            
            communityDiscoveries.push({
                id: `amsterdam_${i}`,
                species: species.name,
                lat: randomDistrict.lat + (Math.random() - 0.5) * locationVariance,
                lng: randomDistrict.lng + (Math.random() - 0.5) * locationVariance,
                user: 'community',
                username: dutchUsernames[Math.floor(Math.random() * dutchUsernames.length)],
                district: randomDistrict.name,
                confidence: Math.floor(Math.random() * 25) + 75, // 75-100%
                rarity: rarities[Math.floor(Math.random() * rarities.length)],
                timestamp: timestamp.toISOString(),
                points: this.calculateSpeciesPoints(species.name, rarities[Math.floor(Math.random() * rarities.length)]),
                weather: this.getRandomWeather(currentSeason),
                timeOfDay: this.getTimeOfDay(timestamp)
            });
        }

        // Add some special discoveries at famous Amsterdam locations
        communityDiscoveries.push(...this.generateLandmarkDiscoveries());

        return communityDiscoveries;
    }

    getWeightedRandomDistrict() {
        // Create weighted array based on population/activity
        const weightedDistricts = [];
        this.amsterdamDistricts.forEach(district => {
            const weight = Math.floor(district.population * 10);
            for (let i = 0; i < weight; i++) {
                weightedDistricts.push(district);
            }
        });
        return weightedDistricts[Math.floor(Math.random() * weightedDistricts.length)];
    }

    getWeightedRandomSpecies(species) {
        const weightedSpecies = [];
        species.forEach(s => {
            const weight = Math.floor(s.weight * 100);
            for (let i = 0; i < weight; i++) {
                weightedSpecies.push(s);
            }
        });
        return weightedSpecies[Math.floor(Math.random() * weightedSpecies.length)];
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    calculateSpeciesPoints(species, rarity) {
        const basePoints = {
            'Butterfly': 50, 'Bee': 40, 'Beetle': 30, 'Spider': 25,
            'Rose': 35, 'Sunflower': 45, 'Oak Leaf': 20, 'Pine Cone': 15,
            'Dutch Elm': 60, 'Canal Duck': 70
        };
        
        const rarityMultiplier = {
            'common': 1.0, 'uncommon': 1.5, 'rare': 2.0, 'epic': 3.0, 'legendary': 5.0
        };
        
        return Math.floor((basePoints[species] || 25) * (rarityMultiplier[rarity] || 1.0));
    }

    getRandomWeather(season) {
        const seasonalWeather = {
            spring: ['cloudy', 'rainy', 'sunny', 'overcast'],
            summer: ['sunny', 'cloudy', 'sunny', 'overcast'],
            autumn: ['rainy', 'cloudy', 'overcast', 'cloudy'],
            winter: ['overcast', 'rainy', 'cloudy', 'overcast']
        };
        const weatherOptions = seasonalWeather[season] || ['cloudy'];
        return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    }

    getTimeOfDay(timestamp) {
        const hour = new Date(timestamp).getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }

    generateLandmarkDiscoveries() {
        const landmarks = [
            { name: 'Rijksmuseum Garden', lat: 52.3600, lng: 4.8852, species: 'Rose' },
            { name: 'Anne Frank House Area', lat: 52.3752, lng: 4.8840, species: 'Dutch Elm' },
            { name: 'Dam Square', lat: 52.3738, lng: 4.8910, species: 'Canal Duck' },
            { name: 'Bloemenmarkt', lat: 52.3675, lng: 4.8913, species: 'Sunflower' },
            { name: 'Royal Palace Garden', lat: 52.3738, lng: 4.8910, species: 'Butterfly' },
            { name: 'Hermitage Amsterdam', lat: 52.3655, lng: 4.9021, species: 'Bee' }
        ];

        return landmarks.map((landmark, index) => ({
            id: `landmark_${index}`,
            species: landmark.species,
            lat: landmark.lat + (Math.random() - 0.5) * 0.002, // Very close to landmark
            lng: landmark.lng + (Math.random() - 0.5) * 0.002,
            user: 'community',
            username: 'TouristExplorer',
            district: landmark.name,
            confidence: Math.floor(Math.random() * 15) + 85, // High confidence at landmarks
            rarity: 'uncommon',
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            points: this.calculateSpeciesPoints(landmark.species, 'uncommon'),
            weather: 'sunny',
            timeOfDay: 'afternoon',
            isLandmark: true
        }));
    }

    createPopupContent(discovery) {
        const timeAgo = this.getTimeAgo(discovery.timestamp);
        const rarityBadge = discovery.rarity ? 
            `<span style="background: #${this.getRarityColor(discovery.rarity)}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.7rem;">${discovery.rarity.toUpperCase()}</span>` : '';
        
        const landmarkBadge = discovery.isLandmark ? 
            `<span style="background: #e67e22; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.7rem;">🏛️ LANDMARK</span>` : '';

        return `
            <div style="min-width: 220px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h4 style="margin: 0; color: #2c3e50;">${discovery.species}</h4>
                    <div style="display: flex; gap: 4px;">
                        ${rarityBadge}
                        ${landmarkBadge}
                    </div>
                </div>
                <div style="font-size: 0.9rem; color: #555;">
                    <p style="margin: 4px 0;"><strong>📍 Location:</strong> ${discovery.district}</p>
                    <p style="margin: 4px 0;"><strong>👤 Found by:</strong> ${discovery.username}</p>
                    <p style="margin: 4px 0;"><strong>🎯 Confidence:</strong> ${discovery.confidence}%</p>
                    <p style="margin: 4px 0;"><strong>⭐ Points:</strong> ${discovery.points}</p>
                    <p style="margin: 4px 0;"><strong>🕐 When:</strong> ${timeAgo}</p>
                    ${discovery.timeOfDay ? `<p style="margin: 4px 0;"><strong>🌅 Time:</strong> ${discovery.timeOfDay}</p>` : ''}
                    ${discovery.weather ? `<p style="margin: 4px 0;"><strong>🌤️ Weather:</strong> ${discovery.weather}</p>` : ''}
                </div>
            </div>
        `;
    }

    // Keep all existing methods (createMapContainer, initializeMap, etc.) but update the map center
    async initializeMap() {
        console.log('Initializing Amsterdam map...');
        try {
            if (typeof L === 'undefined') {
                console.error('Leaflet not loaded');
                this.showMapError('Map library not loaded. Please refresh the page.');
                return;
            }

            const location = await this.getCurrentLocation();
            console.log('Got Amsterdam location:', location);
            
            if (!document.getElementById('mapContainer')) {
                this.createMapContainer();
            }

            if (this.map) {
                this.map.remove();
            }

            // Initialize map centered on Amsterdam
            this.map = L.map('mapContainer').setView([location.lat, location.lng], 12);
            console.log('Amsterdam map created');

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);

            // User marker
            this.userMarker = L.marker([location.lat, location.lng], {
                icon: this.createCustomIcon('user')
            }).addTo(this.map)
              .bindPopup('📍 Your Location in Amsterdam')
              .openPopup();

            await this.loadDiscoveries();
            this.displayDiscoveries();
            this.addMapControls();

            this.isMapInitialized = true;
            console.log('Amsterdam map initialized with', this.discoveries.length, 'discoveries');

            setTimeout(() => {
                this.map.invalidateSize();
            }, 250);

        } catch (error) {
            console.error('Failed to initialize Amsterdam map:', error);
            this.showMapError('Unable to load Amsterdam map. Please check your internet connection.');
        }
    }

    // Keep all other existing methods unchanged...
    createMapContainer() {
        console.log('Creating Amsterdam map container...');
        const mapModal = document.createElement('div');
        mapModal.id = 'mapModal';
        mapModal.className = 'modal map-modal';
        mapModal.innerHTML = `
            <div class="modal-content map-content">
                <div class="map-header">
                    <h2>🗺️ Amsterdam Nature Map</h2>
                    <div class="map-controls">
                        <select id="speciesFilter">
                            <option value="all">All Species</option>
                            <option value="insects">Insects Only</option>
                            <option value="plants">Plants Only</option>
                        </select>
                        <select id="userFilter">
                            <option value="all">Everyone</option>
                            <option value="me">My Discoveries</option>
                            <option value="community">Community</option>
                        </select>
                        <select id="timeFilter">
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                    <button class="close-btn" onclick="document.getElementById('mapModal').style.display='none'">×</button>
                </div>
                <div id="mapContainer" style="height: 500px; width: 100%; background: #f0f0f0;">
                    <div style="text-align: center; padding-top: 200px; color: #666;">
                        Loading Amsterdam nature map...
                    </div>
                </div>
                <div class="map-legend">
                    <div class="legend-item">
                        <span class="legend-icon user">📍</span>
                        <span>Your Location</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-icon mine">🔍</span>
                        <span>Your Discoveries</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-icon community">👥</span>
                        <span>Community Finds</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-icon rare">💎</span>
                        <span>Rare Species</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-icon landmark">🏛️</span>
                        <span>Landmark Areas</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(mapModal);

        // Add event listeners for filters
        setTimeout(() => {
            const speciesFilter = document.getElementById('speciesFilter');
            const userFilter = document.getElementById('userFilter');
            const timeFilter = document.getElementById('timeFilter');

            if (speciesFilter) {
                speciesFilter.addEventListener('change', (e) => {
                    this.filterOptions.species = e.target.value;
                    this.applyFilters();
                });
            }

            if (userFilter) {
                userFilter.addEventListener('change', (e) => {
                    this.filterOptions.user = e.target.value;
                    this.applyFilters();
                });
            }

            if (timeFilter) {
                timeFilter.addEventListener('change', (e) => {
                    this.filterOptions.timeframe = e.target.value;
                    this.applyFilters();
                });
            }
        }, 100);
    }

    // Keep all other existing methods (displayDiscoveries, createCustomIcon, etc.)
    displayDiscoveries() {
        if (!this.map) {
            console.error('Amsterdam map not initialized');
            return;
        }

        console.log('Displaying Amsterdam discoveries on map...');
        this.clearMarkers();

        const filteredDiscoveries = this.applyFiltersToData();
        console.log(`Displaying ${filteredDiscoveries.length} Amsterdam discoveries`);

        filteredDiscoveries.forEach((discovery, index) => {
            try {
                const marker = L.marker([discovery.lat, discovery.lng], {
                    icon: this.createCustomIcon(discovery.user, discovery.rarity)
                }).addTo(this.map);

                const popupContent = this.createPopupContent(discovery);
                marker.bindPopup(popupContent);

                if (discovery.user === 'me') {
                    this.discoveryMarkers.push(marker);
                } else {
                    this.communityMarkers.push(marker);
                }
            } catch (error) {
                console.error('Error adding Amsterdam marker:', error);
            }
        });

        console.log(`Added ${this.discoveryMarkers.length + this.communityMarkers.length} Amsterdam markers`);
    }

    createCustomIcon(type, rarity = 'common') {
        const iconMap = {
            user: '📍',
            me: '🔍',
            community: '👥'
        };

        let icon = iconMap[type] || '📌';
        let bgColor = '#ffffff';
        
        if (rarity === 'uncommon') bgColor = '#3498db';
        else if (rarity === 'rare') bgColor = '#9b59b6';
        else if (rarity === 'epic') bgColor = '#e67e22';
        else if (rarity === 'legendary') bgColor = '#f1c40f';

        return L.divIcon({
            html: `<div style="
                background: ${bgColor}; 
                border: 2px solid #2c3e50; 
                border-radius: 50%; 
                width: 30px; 
                height: 30px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">${icon}</div>`,
            className: 'custom-marker-container',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    getRarityColor(rarity) {
        const colors = {
            common: '95a5a6',
            uncommon: '3498db',
            rare: '9b59b6',
            epic: 'e67e22',
            legendary: 'f1c40f'
        };
        return colors[rarity] || colors.common;
    }

    applyFiltersToData() {
        let filtered = [...this.discoveries];

        if (this.filterOptions.species === 'insects') {
            filtered = filtered.filter(d => ['Butterfly', 'Bee', 'Spider', 'Beetle'].includes(d.species));
        } else if (this.filterOptions.species === 'plants') {
            filtered = filtered.filter(d => ['Rose', 'Oak Leaf', 'Sunflower', 'Pine Cone', 'Dutch Elm'].includes(d.species));
        }

        if (this.filterOptions.user === 'me') {
            filtered = filtered.filter(d => d.user === 'me');
        } else if (this.filterOptions.user === 'community') {
            filtered = filtered.filter(d => d.user === 'community');
        }

        const now = new Date();
        if (this.filterOptions.timeframe === 'today') {
            const today = new Date().toDateString();
            filtered = filtered.filter(d => new Date(d.timestamp).toDateString() === today);
        } else if (this.filterOptions.timeframe === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(d => new Date(d.timestamp) >= weekAgo);
        } else if (this.filterOptions.timeframe === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(d => new Date(d.timestamp) >= monthAgo);
        }

        return filtered;
    }

    applyFilters() {
        if (this.isMapInitialized) {
            this.displayDiscoveries();
        }
    }

    clearMarkers() {
        [...this.discoveryMarkers, ...this.communityMarkers].forEach(marker => {
            if (this.map) {
                this.map.removeLayer(marker);
            }
        });
        this.discoveryMarkers = [];
        this.communityMarkers = [];
    }

    addMapControls() {
        if (!this.map) return;

        const centerControl = L.control({ position: 'topleft' });
        centerControl.onAdd = () => {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            div.innerHTML = '<a href="#" title="Center on Amsterdam" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; text-decoration: none;">🏛️</a>';
            div.onclick = (e) => {
                e.preventDefault();
                this.map.setView([this.baseLocation.lat, this.baseLocation.lng], 12);
            };
            return div;
        };
        centerControl.addTo(this.map);

        const statsControl = L.control({ position: 'bottomright' });
        statsControl.onAdd = () => {
            const div = L.DomUtil.create('div');
            div.className = 'map-stats';
            const myDiscoveries = this.discoveries.filter(d => d.user === 'me').length;
            const communityDiscoveries = this.discoveries.filter(d => d.user === 'community').length;
            
            div.innerHTML = `
                <div style="background: rgba(255,255,255,0.9); padding: 8px; border-radius: 4px; font-size: 12px;">
                    <div><strong>Amsterdam Discoveries</strong></div>
                    <div>Your: ${myDiscoveries}</div>
                    <div>Community: ${communityDiscoveries}</div>
                    <div>Total: ${this.discoveries.length}</div>
                </div>
            `;
            return div;
        };
        statsControl.addTo(this.map);
    }

    showMap() {
        console.log('ShowMap called for Amsterdam');
        
        if (typeof L === 'undefined') {
            console.error('Leaflet not available');
            alert('Map library is loading. Please wait a moment and try again.');
            return;
        }

        const modal = document.getElementById('mapModal');
        if (modal) {
            modal.style.display = 'flex';
            
            if (!this.isMapInitialized) {
                setTimeout(() => {
                    this.initializeMap();
                }, 250);
            } else {
                setTimeout(() => {
                    if (this.map) {
                        this.map.invalidateSize();
                    }
                }, 250);
            }
        } else {
            console.error('Map modal not found');
            this.createMapContainer();
            setTimeout(() => this.showMap(), 100);
        }
    }

    addDiscovery(discovery, lat, lng) {
        // Ensure new discoveries are placed in Amsterdam area
        let discoveryLat = lat;
        let discoveryLng = lng;
        
        // If coordinates are far from Amsterdam, place in random Amsterdam district
        const distance = this.calculateDistance(lat, lng, this.baseLocation.lat, this.baseLocation.lng);
        if (distance > 25) { // If more than 25km from Amsterdam center
            const randomDistrict = this.amsterdamDistricts[Math.floor(Math.random() * this.amsterdamDistricts.length)];
            discoveryLat = randomDistrict.lat + (Math.random() - 0.5) * 0.01;
            discoveryLng = randomDistrict.lng + (Math.random() - 0.5) * 0.01;
        }

        const newDiscovery = {
            ...discovery,
            lat: discoveryLat,
            lng: discoveryLng,
            user: 'me',
            username: 'You',
            id: `user_${Date.now()}`,
            district: this.getNearestDistrict(discoveryLat, discoveryLng)
        };

        this.discoveries.push(newDiscovery);
        
        if (this.isMapInitialized) {
            this.displayDiscoveries();
        }
    }

    getNearestDistrict(lat, lng) {
        let nearest = this.amsterdamDistricts[0];
        let minDistance = this.calculateDistance(lat, lng, nearest.lat, nearest.lng);
        
        this.amsterdamDistricts.forEach(district => {
            const distance = this.calculateDistance(lat, lng, district.lat, district.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = district;
            }
        });
        
        return nearest.name;
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }

    showMapError(message) {
        console.error('Amsterdam map error:', message);
        alert(message);
    }
}
