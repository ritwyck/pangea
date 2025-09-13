class DetectionEngine {
    constructor() {
        this.species = [
            // Insects
            { name: 'Butterfly', category: 'insect', points: 50, rarity: 'uncommon' },
            { name: 'Bee', category: 'insect', points: 40, rarity: 'common' },
            { name: 'Beetle', category: 'insect', points: 30, rarity: 'common' },
            { name: 'Spider', category: 'insect', points: 25, rarity: 'common' },
            // Plants
            { name: 'Rose', category: 'flower', points: 35, rarity: 'common' },
            { name: 'Sunflower', category: 'flower', points: 45, rarity: 'uncommon' },
            { name: 'Oak Leaf', category: 'plant', points: 20, rarity: 'common' },
            { name: 'Pine Cone', category: 'plant', points: 15, rarity: 'common' }
        ];

        this.currentDetection = null;
        this.isDetecting = false;
        this.detectionInterval = null;
        this.confidenceRange = { min: 65, max: 95 };
    }

    startDetection() {
        if (this.isDetecting) return;
        
        this.isDetecting = true;
        console.log('Detection engine started');

        // Start continuous detection simulation
        this.detectionInterval = setInterval(() => {
            this.simulateDetection();
        }, 2000); // Update every 2 seconds

        // Initial detection
        this.simulateDetection();
    }

    stopDetection() {
        if (!this.isDetecting) return;

        this.isDetecting = false;
        
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }

        this.currentDetection = null;
        console.log('Detection engine stopped');
    }

    simulateDetection() {
        // Randomly decide if we detect something (80% chance)
        if (Math.random() < 0.2) {
            this.currentDetection = null;
            this.updateDetectionDisplay('Scanning...', 0, 0);
            return;
        }

        // Select random species
        const randomSpecies = this.species[Math.floor(Math.random() * this.species.length)];
        
        // Generate random confidence within range
        const confidence = Math.floor(
            Math.random() * (this.confidenceRange.max - this.confidenceRange.min + 1)
        ) + this.confidenceRange.min;

        // Add some variation to points based on confidence
        const pointsVariation = Math.floor((confidence / 100) * randomSpecies.points);
        const adjustedPoints = Math.max(5, pointsVariation);

        this.currentDetection = {
            species: randomSpecies.name,
            category: randomSpecies.category,
            basePoints: randomSpecies.points,
            adjustedPoints: adjustedPoints,
            confidence: confidence,
            rarity: randomSpecies.rarity,
            timestamp: Date.now()
        };

        this.updateDetectionDisplay(
            randomSpecies.name,
            confidence,
            adjustedPoints
        );

        console.log(`Detected: ${randomSpecies.name} (${confidence}% confidence, ${adjustedPoints} points)`);
    }

    updateDetectionDisplay(species, confidence, points) {
        const speciesElement = document.getElementById('detectedSpecies');
        const confidenceElement = document.getElementById('confidenceLevel');
        const pointsElement = document.getElementById('pointsPreview');

        if (speciesElement) speciesElement.textContent = species;
        if (confidenceElement) confidenceElement.textContent = `${confidence}%`;
        if (pointsElement) pointsElement.textContent = points;

        // Update detection box styling based on confidence
        const detectionBox = document.querySelector('.detection-box');
        if (detectionBox && species !== 'Scanning...') {
            if (confidence >= 85) {
                detectionBox.style.borderColor = '#27ae60'; // Green for high confidence
            } else if (confidence >= 70) {
                detectionBox.style.borderColor = '#f39c12'; // Orange for medium confidence
            } else {
                detectionBox.style.borderColor = '#e74c3c'; // Red for low confidence
            }
        } else if (detectionBox) {
            detectionBox.style.borderColor = '#fff'; // Default white
        }
    }

    getCurrentDetection() {
        return this.currentDetection;
    }

    isCurrentlyDetecting() {
        return this.isDetecting && this.currentDetection !== null;
    }

    getSpeciesByName(name) {
        return this.species.find(s => s.name === name);
    }

    getAllSpecies() {
        return [...this.species];
    }

    // Simulate better detection over time (future enhancement)
    improveDetection() {
        // Could be used to increase confidence ranges as player progresses
        this.confidenceRange.min = Math.min(75, this.confidenceRange.min + 1);
        this.confidenceRange.max = Math.min(98, this.confidenceRange.max + 1);
    }
}
