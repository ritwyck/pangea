class DetectionEngine {
    constructor() {
        this.species = [
            // Keep the species for reference but we'll always detect Beautiful People
            { name: 'Butterfly', category: 'insect', points: 50, rarity: 'uncommon' },
            { name: 'Bee', category: 'insect', points: 40, rarity: 'common' },
            { name: 'Beetle', category: 'insect', points: 30, rarity: 'common' },
            { name: 'Spider', category: 'insect', points: 25, rarity: 'common' },
            { name: 'Rose', category: 'flower', points: 35, rarity: 'common' },
            { name: 'Sunflower', category: 'flower', points: 45, rarity: 'uncommon' },
            { name: 'Oak Leaf', category: 'plant', points: 20, rarity: 'common' },
            { name: 'Pine Cone', category: 'plant', points: 15, rarity: 'common' },
            { name: 'Beautiful People', category: 'human', points: 100, rarity: 'legendary' }
        ];

        this.currentDetection = null;
        this.isDetecting = false;
        this.detectionInterval = null;
        this.searchPhase = 'scanning'; // 'scanning', 'analyzing', 'shuffling', 'final'
        this.searchStep = 0;
        this.searchSequence = [];
        
        console.log('🎭 Demo Detection Engine: Always finds Beautiful People!');
    }

    startDetection() {
        if (this.isDetecting) return;
        
        this.isDetecting = true;
        this.searchPhase = 'scanning';
        this.searchStep = 0;
        console.log('🔍 Demo detection started - searching for Beautiful People...');

        // Start the demo detection sequence
        this.detectionInterval = setInterval(() => {
            this.runDemoDetectionSequence();
        }, 1200); // Slightly slower for better demo effect

        // Start immediately
        this.runDemoDetectionSequence();
    }

    stopDetection() {
        if (!this.isDetecting) return;

        this.isDetecting = false;
        
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }

        this.currentDetection = null;
        this.searchPhase = 'scanning';
        this.searchStep = 0;
        console.log('🛑 Demo detection stopped');
    }

    runDemoDetectionSequence() {
        switch (this.searchPhase) {
            case 'scanning':
                this.showScanningPhase();
                break;
            case 'analyzing':
                this.showAnalyzingPhase();
                break;
            case 'shuffling':
                this.showShufflingPhase();
                break;
            case 'final':
                this.showFinalDetection();
                break;
        }
    }

    showScanningPhase() {
        const scanningMessages = [
            'Scanning environment...',
            'Analyzing visual data...',
            'Processing camera feed...',
            'Detecting subjects...',
            'Initializing recognition...'
        ];

        this.updateDetectionDisplay(
            scanningMessages[this.searchStep % scanningMessages.length], 
            0, 
            0, 
            false, 
            true
        );

        this.searchStep++;
        
        // After 3-4 scanning cycles, move to analyzing
        if (this.searchStep >= 4) {
            this.searchPhase = 'analyzing';
            this.searchStep = 0;
            this.generateShuffleSequence();
        }
    }

    showAnalyzingPhase() {
        const analyzingMessages = [
            'Analyzing subjects...',
            'Running classification...',
            'Processing features...',
            'Calculating confidence...'
        ];

        this.updateDetectionDisplay(
            analyzingMessages[this.searchStep % analyzingMessages.length], 
            Math.floor(Math.random() * 30) + 10, // Random low confidence 
            0, 
            false, 
            true
        );

        this.searchStep++;
        
        // After 2-3 analyzing cycles, move to shuffling
        if (this.searchStep >= 3) {
            this.searchPhase = 'shuffling';
            this.searchStep = 0;
        }
    }

    generateShuffleSequence() {
        // Create a realistic shuffle sequence that leads to Beautiful People
        this.searchSequence = [
            { name: 'Analyzing movement...', confidence: Math.floor(Math.random() * 20) + 40 },
            { name: 'Rose', confidence: Math.floor(Math.random() * 15) + 60 },
            { name: 'Detecting features...', confidence: Math.floor(Math.random() * 15) + 65 },
            { name: 'Butterfly', confidence: Math.floor(Math.random() * 12) + 70 },
            { name: 'Bee', confidence: Math.floor(Math.random() * 10) + 75 },
            { name: 'Refining analysis...', confidence: Math.floor(Math.random() * 8) + 80 },
            { name: 'Sunflower', confidence: Math.floor(Math.random() * 8) + 85 },
            { name: 'Final classification...', confidence: Math.floor(Math.random() * 5) + 90 },
            { name: 'Beetle', confidence: Math.floor(Math.random() * 5) + 92 },
            { name: 'Confirming results...', confidence: 95 }
        ];
    }

    showShufflingPhase() {
        if (this.searchStep >= this.searchSequence.length) {
            // Move to final detection
            this.searchPhase = 'final';
            this.searchStep = 0;
            return;
        }

        const currentItem = this.searchSequence[this.searchStep];
        const species = this.species.find(s => s.name === currentItem.name);
        
        // Calculate points based on what we're "detecting"
        let points = 0;
        if (species) {
            points = Math.floor((currentItem.confidence / 100) * species.points);
        }

        this.updateDetectionDisplay(
            currentItem.name,
            currentItem.confidence,
            points,
            false,
            true // indicate shuffling
        );

        this.searchStep++;
    }

    showFinalDetection() {
        // Always detect Beautiful People with 100% confidence
        this.currentDetection = {
            species: 'Beautiful People',
            category: 'human',
            basePoints: 100,
            adjustedPoints: 100,
            confidence: 100,
            rarity: 'legendary',
            timestamp: Date.now(),
            isSpecialDetection: true,
            isDemoMode: true
        };

        this.updateDetectionDisplay('Beautiful People', 100, 100, true);
        
        // Stay in final phase - keep showing Beautiful People
        console.log('✨ Demo Detection Complete: Beautiful People found!');
    }

    updateDetectionDisplay(species, confidence, points, isSpecial = false, isProcessing = false) {
        const speciesElement = document.getElementById('detectedSpecies');
        const confidenceElement = document.getElementById('confidenceLevel');
        const pointsElement = document.getElementById('pointsPreview');

        if (speciesElement) {
            speciesElement.textContent = species;
            
            if (isSpecial) {
                // Beautiful People special styling
                speciesElement.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)';
                speciesElement.style.backgroundSize = '400% 400%';
                speciesElement.style.animation = 'rainbow 2s ease infinite';
                speciesElement.style.color = 'white';
                speciesElement.style.padding = '0.8rem';
                speciesElement.style.borderRadius = '15px';
                speciesElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';
                speciesElement.style.fontWeight = 'bold';
                speciesElement.style.fontSize = '1.4em';
            } else if (isProcessing) {
                // Processing/scanning styling
                speciesElement.style.background = '';
                speciesElement.style.animation = 'pulse 1s ease infinite';
                speciesElement.style.color = '#4ecdc4';
                speciesElement.style.padding = '0.5rem';
                speciesElement.style.borderRadius = '10px';
                speciesElement.style.textShadow = '';
                speciesElement.style.fontWeight = 'normal';
                speciesElement.style.fontSize = '1em';
                
                // Add dots animation for processing messages
                if (species.includes('...')) {
                    speciesElement.style.animation = 'processing 1.5s ease infinite';
                }
            } else {
                // Reset styling
                speciesElement.style.background = '';
                speciesElement.style.animation = '';
                speciesElement.style.color = '#4ecdc4';
                speciesElement.style.padding = '';
                speciesElement.style.borderRadius = '';
                speciesElement.style.textShadow = '';
                speciesElement.style.fontWeight = '';
                speciesElement.style.fontSize = '';
            }
        }
        
        if (confidenceElement) {
            confidenceElement.textContent = `${confidence}%`;
            
            if (isSpecial) {
                confidenceElement.style.color = '#27ae60';
                confidenceElement.style.fontWeight = 'bold';
                confidenceElement.style.fontSize = '1.3em';
                confidenceElement.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
            } else if (isProcessing && confidence > 0) {
                confidenceElement.style.color = '#f39c12';
                confidenceElement.style.fontWeight = 'normal';
                confidenceElement.style.fontSize = '1em';
                confidenceElement.style.textShadow = '';
            } else {
                confidenceElement.style.color = '';
                confidenceElement.style.fontWeight = '';
                confidenceElement.style.fontSize = '';
                confidenceElement.style.textShadow = '';
            }
        }
        
        if (pointsElement) {
            pointsElement.textContent = points;
            
            if (isSpecial) {
                pointsElement.style.color = '#f1c40f';
                pointsElement.style.fontWeight = 'bold';
                pointsElement.style.fontSize = '1.3em';
                pointsElement.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
            } else {
                pointsElement.style.color = '';
                pointsElement.style.fontWeight = '';
                pointsElement.style.fontSize = '';
                pointsElement.style.textShadow = '';
            }
        }

        // Update detection box styling
        const detectionBox = document.querySelector('.detection-box');
        if (detectionBox) {
            if (isSpecial) {
                detectionBox.style.borderColor = '#f1c40f';
                detectionBox.style.borderWidth = '4px';
                detectionBox.style.boxShadow = '0 0 30px rgba(241, 196, 15, 1), 0 0 60px rgba(241, 196, 15, 0.5)';
                detectionBox.style.background = 'rgba(0,0,0,0.95)';
                detectionBox.style.animation = 'glow 2s ease infinite alternate';
            } else if (isProcessing) {
                detectionBox.style.borderColor = '#3498db';
                detectionBox.style.borderWidth = '2px';
                detectionBox.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.5)';
                detectionBox.style.background = 'rgba(0,0,0,0.8)';
                detectionBox.style.animation = 'scan 2s ease infinite';
            } else {
                detectionBox.style.borderColor = '#fff';
                detectionBox.style.borderWidth = '2px';
                detectionBox.style.boxShadow = '';
                detectionBox.style.background = 'rgba(0,0,0,0.8)';
                detectionBox.style.animation = '';
            }
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

    // Reset detection sequence (for demo purposes)
    resetDetectionSequence() {
        this.searchPhase = 'scanning';
        this.searchStep = 0;
        this.currentDetection = null;
        console.log('🔄 Demo detection sequence reset');
    }

    // Skip to final result (for quick demo)
    skipToResult() {
        this.searchPhase = 'final';
        this.searchStep = 0;
        console.log('⏩ Skipped to Beautiful People detection');
    }
}
