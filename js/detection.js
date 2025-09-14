class DetectionEngine {
    constructor() {
        this.species = [
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
        this.searchPhase = 'scanning';
        this.searchStep = 0;
        this.searchSequence = [];
        
        console.log('🎭 Fast Demo Detection Engine: Instant Beautiful People detection!');
    }

    startDetection() {
        if (this.isDetecting) return;
        
        this.isDetecting = true;
        this.searchPhase = 'scanning';
        this.searchStep = 0;
        console.log('🚀 FAST detection started - quick Beautiful People detection...');

        // Much faster detection sequence
        this.detectionInterval = setInterval(() => {
            this.runFastDetectionSequence();
        }, 100); // 3x faster - 400ms instead of 1200ms

        // Start immediately
        this.runFastDetectionSequence();
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
        console.log('🛑 Fast detection stopped');
    }

    runFastDetectionSequence() {
        switch (this.searchPhase) {
            case 'scanning':
                this.showFastScanningPhase();
                break;
            case 'analyzing':
                this.showFastAnalyzingPhase();
                break;
            case 'final':
                this.showFinalDetection();
                break;
        }
    }

    showFastScanningPhase() {
        const quickScanMessages = [
            'Scanning...',
            'Analyzing...',
            'Processing...'
        ];

        this.updateDetectionDisplay(
            quickScanMessages[this.searchStep % quickScanMessages.length], 
            0, 
            0, 
            false, 
            true
        );

        this.searchStep++;
        
        // Only 2 scanning cycles before analyzing
        if (this.searchStep >= 2) {
            this.searchPhase = 'analyzing';
            this.searchStep = 0;
            this.generateFastSequence();
        }
    }

    showFastAnalyzingPhase() {
        if (this.searchStep >= this.searchSequence.length) {
            this.searchPhase = 'final';
            this.searchStep = 0;
            return;
        }

        const currentItem = this.searchSequence[this.searchStep];
        const species = this.species.find(s => s.name === currentItem.name);
        
        let points = 0;
        if (species) {
            points = Math.floor((currentItem.confidence / 100) * species.points);
        }

        this.updateDetectionDisplay(
            currentItem.name,
            currentItem.confidence,
            points,
            false,
            true
        );

        this.searchStep++;
    }

    generateFastSequence() {
        // Much shorter sequence - only 4 steps instead of 10
        this.searchSequence = [
            { name: 'Movement detected...', confidence: 45 },
            { name: 'Rose', confidence: 65 },
            { name: 'Analyzing features...', confidence: 85 },
            { name: 'Classification complete', confidence: 95 }
        ];
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
        
        console.log('✨ FAST Detection Complete: Beautiful People found in record time!');
    }

    updateDetectionDisplay(species, confidence, points, isSpecial = false, isProcessing = false) {
        const speciesElement = document.getElementById('detectedSpecies');
        const confidenceElement = document.getElementById('confidenceLevel');
        const pointsElement = document.getElementById('pointsPreview');

        if (speciesElement) {
            speciesElement.textContent = species;
            
            if (isSpecial) {
                // Beautiful People special styling - enhanced for speed demo
                speciesElement.className = 'beautiful-people';
                speciesElement.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)';
                speciesElement.style.backgroundSize = '400% 400%';
                speciesElement.style.animation = 'rainbow 1.5s ease infinite'; // Faster animation
                speciesElement.style.webkitBackgroundClip = 'text';
                speciesElement.style.webkitTextFillColor = 'transparent';
                speciesElement.style.backgroundClip = 'text';
                speciesElement.style.fontWeight = '900';
                speciesElement.style.fontSize = '1.6em';
                speciesElement.style.textTransform = 'uppercase';
                speciesElement.style.letterSpacing = '0.1em';
            } else if (isProcessing) {
                speciesElement.style.background = '';
                speciesElement.style.animation = 'fastPulse 0.8s ease infinite'; // Faster pulse
                speciesElement.style.color = '#4ecdc4';
                speciesElement.style.fontWeight = '600';
                speciesElement.style.fontSize = '1.1em';
            } else {
                // Reset styling
                speciesElement.style.cssText = '';
                speciesElement.style.color = '#4ecdc4';
            }
        }
        
        if (confidenceElement) {
            if (confidence === 0) {
                confidenceElement.textContent = 'confidence';
            } else {
                confidenceElement.textContent = `${confidence}% confidence`;
            }
            
            if (isSpecial) {
                confidenceElement.style.color = '#27ae60';
                confidenceElement.style.fontWeight = 'bold';
                confidenceElement.style.fontSize = '1.4em';
                confidenceElement.style.textShadow = '2px 2px 4px rgba(39, 174, 96, 0.3)';
            } else {
                confidenceElement.style.cssText = '';
                confidenceElement.style.color = confidence > 80 ? '#27ae60' : confidence > 50 ? '#f39c12' : '#e74c3c';
            }
        }
        
        if (pointsElement) {
            pointsElement.textContent = `+${points} points`;
            
            if (isSpecial) {
                pointsElement.style.color = '#f1c40f';
                pointsElement.style.fontWeight = 'bold';
                pointsElement.style.fontSize = '1.4em';
                pointsElement.style.textShadow = '2px 2px 4px rgba(241, 196, 15, 0.3)';
                pointsElement.style.animation = 'pointsGlow 1s ease infinite alternate';
            } else {
                pointsElement.style.cssText = '';
                pointsElement.style.color = '#f39c12';
            }
        }

        // Enhanced detection box styling for speed demo
        const detectionBox = document.querySelector('.detection-box');
        if (detectionBox) {
            if (isSpecial) {
                detectionBox.style.border = '4px solid #f1c40f';
                detectionBox.style.boxShadow = '0 0 40px rgba(241, 196, 15, 0.8), 0 0 80px rgba(241, 196, 15, 0.4)';
                detectionBox.style.background = 'rgba(6, 78, 59, 0.95)';
                detectionBox.style.animation = 'legendaryGlow 1.5s ease infinite alternate';
            } else if (isProcessing) {
                detectionBox.style.border = '3px solid #3498db';
                detectionBox.style.boxShadow = '0 0 20px rgba(52, 152, 219, 0.6)';
                detectionBox.style.animation = 'fastScan 1s ease infinite';
            } else {
                detectionBox.style.cssText = '';
            }
        }
    }

    // Quick detection methods for instant demo
    instantDetection() {
        console.log('⚡ INSTANT Beautiful People detection!');
        this.searchPhase = 'final';
        this.searchStep = 0;
        this.showFinalDetection();
    }

    // Skip all phases - go straight to result
    skipToResult() {
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
        }
        this.instantDetection();
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

    resetDetectionSequence() {
        this.searchPhase = 'scanning';
        this.searchStep = 0;
        this.currentDetection = null;
        console.log('🔄 Fast detection reset');
    }
}
