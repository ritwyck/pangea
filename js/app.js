class InsectDetectionGame {
    constructor() {
        this.camera = new CameraManager();
        this.storage = new StorageManager();
        this.detection = new DetectionEngine();
        
        this.isGameActive = false;
        this.currentScreen = 'game'; // 'game' or 'collection'
        
        this.initializeApp();
    }

    initializeApp() {
        console.log('Initializing Insect Detection Game...');
        
        // Bind event listeners
        this.bindEventListeners();
        
        // Update UI with saved data
        this.updateUserStats();
        
        // Check for camera support
        this.checkCameraSupport();
        
        console.log('Game initialized successfully');
    }

    bindEventListeners() {
        // Camera controls
        document.getElementById('startCameraBtn').addEventListener('click', () => {
            this.startGame();
        });

        // Capture button
        document.getElementById('captureBtn').addEventListener('click', () => {
            this.captureDiscovery();
        });

        // Navigation
        document.getElementById('viewCollectionBtn').addEventListener('click', () => {
            this.showCollection();
        });

        document.getElementById('backToGameBtn').addEventListener('click', () => {
            this.showGame();
        });

        // Modal
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Handle page visibility change (pause/resume detection)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isGameActive) {
                this.detection.stopDetection();
            } else if (!document.hidden && this.isGameActive && this.camera.isReady()) {
                this.detection.startDetection();
            }
        });
    }

    checkCameraSupport() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Camera access is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
            document.getElementById('startCameraBtn').disabled = true;
        }
    }

    async startGame() {
        console.log('Starting game...');
        
        const cameraStarted = await this.camera.startCamera();
        
        if (cameraStarted) {
            this.isGameActive = true;
            
            // Wait for video to be ready before starting detection
            this.camera.video.addEventListener('loadeddata', () => {
                this.detection.startDetection();
                console.log('Game started successfully');
            });
        }
    }

    stopGame() {
        console.log('Stopping game...');
        
        this.isGameActive = false;
        this.detection.stopDetection();
        this.camera.stopCamera();
        
        console.log('Game stopped');
    }

    captureDiscovery() {
        if (!this.camera.isReady()) {
            alert('Camera is not ready. Please wait a moment.');
            return;
        }

        const currentDetection = this.detection.getCurrentDetection();
        if (!currentDetection) {
            alert('No species detected. Please wait for detection.');
            return;
        }

        // Capture photo
        const photo = this.camera.capturePhoto();
        if (!photo) {
            alert('Failed to capture photo. Please try again.');
            return;
        }

        // Save discovery
        const result = this.storage.addDiscovery(
            currentDetection.species,
            currentDetection.adjustedPoints,
            photo,
            currentDetection.confidence
        );

        if (result) {
            // Update UI stats
            this.updateUserStats();
            
            // Show success modal
            this.showDiscoveryModal(result.discovery, result.isNewSpecies);
            
            // Brief pause in detection after capture
            this.detection.stopDetection();
            setTimeout(() => {
                if (this.isGameActive && this.camera.isReady()) {
                    this.detection.startDetection();
                }
            }, 3000);
        }
    }

    updateUserStats() {
        const profile = this.storage.getUserProfile();
        if (profile) {
            document.getElementById('totalPoints').textContent = profile.totalPoints;
            document.getElementById('totalDiscoveries').textContent = this.storage.getUniqueSpeciesCount();
        }
    }

    showCollection() {
        this.currentScreen = 'collection';
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('collectionScreen').style.display = 'block';
        
        // Pause game if active
        if (this.isGameActive) {
            this.detection.stopDetection();
        }
        
        this.renderCollection();
    }

    showGame() {
        this.currentScreen = 'game';
        document.getElementById('collectionScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        
        // Resume game if camera is active
        if (this.isGameActive && this.camera.isReady()) {
            this.detection.startDetection();
        }
    }

    renderCollection() {
        const cardsGrid = document.getElementById('cardsGrid');
        const collection = this.storage.getSpeciesCollection();
        
        if (collection.length === 0) {
            cardsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #7f8c8d;">
                    <h3>No discoveries yet!</h3>
                    <p>Start capturing insects and plants to build your collection.</p>
                </div>
            `;
            return;
        }

        cardsGrid.innerHTML = collection.map(discovery => `
            <div class="species-card">
                <img src="${discovery.photo}" alt="${discovery.species}" class="card-image">
                <div class="card-info">
                    <h4>${discovery.species}</h4>
                    <div class="card-stats">
                        <span>+${discovery.points} pts</span>
                        <span>${discovery.confidence}% confidence</span>
                    </div>
                    <div class="card-stats">
                        <span>${new Date(discovery.timestamp).toLocaleDateString()}</span>
                        <span>${this.getSpeciesCategory(discovery.species)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getSpeciesCategory(speciesName) {
        const species = this.detection.getSpeciesByName(speciesName);
        return species ? species.category : 'unknown';
    }

    showDiscoveryModal(discovery, isNewSpecies) {
        const modal = document.getElementById('successModal');
        const discoveredCard = document.getElementById('discoveredCard');
        
        discoveredCard.innerHTML = `
            <div class="species-card">
                <img src="${discovery.photo}" alt="${discovery.species}" class="card-image">
                <div class="card-info">
                    <h4>${discovery.species}</h4>
                    <div class="card-stats">
                        <span style="color: #27ae60; font-weight: bold;">+${discovery.points} points</span>
                    </div>
                    <div class="card-stats">
                        <span>${discovery.confidence}% confidence</span>
                        <span>${isNewSpecies ? '🆕 New Species!' : '📸 Captured Again'}</span>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }

    closeModal() {
        document.getElementById('successModal').style.display = 'none';
    }

    // Debug methods
    resetGame() {
        this.storage.resetGameData();
        this.updateUserStats();
        this.renderCollection();
        console.log('Game data reset');
    }

    exportData() {
        const data = this.storage.exportData();
        console.log('Game Data Export:', data);
        return data;
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new InsectDetectionGame();
    
    // Expose debug methods to console
    window.resetGame = () => window.game.resetGame();
    window.exportData = () => window.game.exportData();
    
    console.log('🔍 Nature Detective Game Loaded!');
    console.log('Debug commands: resetGame(), exportData()');
});
