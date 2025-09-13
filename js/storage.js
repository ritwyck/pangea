class StorageManager {
    constructor() {
        this.storageKey = 'insectDetectionGame';
        this.initializeStorage();
    }

    initializeStorage() {
        const existingData = localStorage.getItem(this.storageKey);
        
        if (!existingData) {
            const initialData = {
                userProfile: {
                    totalPoints: 0,
                    totalDiscoveries: 0,
                    firstPlayDate: new Date().toISOString()
                },
                discoveredSpecies: [],
                gameStats: {
                    totalCaptures: 0,
                    uniqueSpecies: 0,
                    lastPlayDate: new Date().toISOString()
                }
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
            console.log('Initialized new game data');
        } else {
            console.log('Loaded existing game data');
        }
    }

    getGameData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    saveGameData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        console.log('Game data saved');
    }

    getUserProfile() {
        const data = this.getGameData();
        return data ? data.userProfile : null;
    }

    getDiscoveredSpecies() {
        const data = this.getGameData();
        return data ? data.discoveredSpecies : [];
    }

    addDiscovery(species, points, photo, confidence) {
        const data = this.getGameData();
        if (!data) return false;

        // Check if this species was already discovered
        const existingSpecies = data.discoveredSpecies.find(s => s.species === species);
        const isNewSpecies = !existingSpecies;

        // Create discovery record
        const discovery = {
            id: `${species.toLowerCase()}_${Date.now()}`,
            species: species,
            points: points,
            photo: photo,
            confidence: confidence,
            timestamp: new Date().toISOString(),
            isNew: isNewSpecies
        };

        // Add to discoveries
        data.discoveredSpecies.push(discovery);

        // Update user profile
        data.userProfile.totalPoints += points;
        data.userProfile.totalDiscoveries += 1;

        // Update game stats
        data.gameStats.totalCaptures += 1;
        data.gameStats.lastPlayDate = new Date().toISOString();
        
        if (isNewSpecies) {
            data.gameStats.uniqueSpecies += 1;
        }

        // Save updated data
        this.saveGameData(data);

        console.log(`Added discovery: ${species} (+${points} points)`);
        return { discovery, isNewSpecies };
    }

    getUniqueSpeciesCount() {
        const discoveries = this.getDiscoveredSpecies();
        const uniqueSpecies = new Set(discoveries.map(d => d.species));
        return uniqueSpecies.size;
    }

    getSpeciesCollection() {
        const discoveries = this.getDiscoveredSpecies();
        const speciesMap = new Map();

        // Group discoveries by species, keeping the latest photo
        discoveries.forEach(discovery => {
            if (!speciesMap.has(discovery.species) || 
                new Date(discovery.timestamp) > new Date(speciesMap.get(discovery.species).timestamp)) {
                speciesMap.set(discovery.species, discovery);
            }
        });

        return Array.from(speciesMap.values()).sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    }

    resetGameData() {
        localStorage.removeItem(this.storageKey);
        this.initializeStorage();
        console.log('Game data reset');
    }

    exportData() {
        return this.getGameData();
    }
}
