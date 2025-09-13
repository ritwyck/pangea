// Enhanced InsectDetectionGame class - Replace existing app.js
class InsectDetectionGame {
    constructor() {
        this.camera = new CameraManager();
        this.storage = new StorageManager();
        this.detection = new DetectionEngine();
        this.progression = new ProgressionSystem();
        this.challenges = new ChallengeSystem();
        this.weather = new WeatherSystem();
        this.ui = new EnhancedUI(this);
        
        this.isGameActive = false;
        this.currentScreen = 'game';
        this.dailyChallenges = [];
        this.streakData = {
            daily: 0,
            perfect: 0,
            lastPerfectConfidence: 0
        };
        
        this.initializeApp();
    }

    async initializeApp() {
        console.log('Initializing Enhanced Insect Detection Game...');
        
        // Initialize weather system
        await this.weather.fetchWeatherData();
        this.ui.updateWeatherWidget(this.weather.weatherData);
        
        // Load daily challenges
        this.loadDailyChallenges();
        
        // Bind event listeners
        this.bindEventListeners();
        
        // Update UI with saved data
        this.updateAllUI();
        
        // Check for camera support
        this.checkCameraSupport();
        
        // Start periodic updates
        this.startPeriodicUpdates();
        
        this.ui.showNotification('🌟 Welcome to Enhanced Nature Detective!', 'success', 4000);
        console.log('Enhanced game initialized successfully');
    }

    bindEventListeners() {
        // Existing event listeners
        document.getElementById('startCameraBtn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('captureBtn').addEventListener('click', () => {
            this.captureDiscovery();
        });

        document.getElementById('viewCollectionBtn').addEventListener('click', () => {
            this.showCollection();
        });

        document.getElementById('backToGameBtn').addEventListener('click', () => {
            this.showGame();
        });

        document.getElementById('closeModalBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // New enhanced event listeners
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isGameActive) {
                this.detection.stopDetection();
            } else if (!document.hidden && this.isGameActive && this.camera.isReady()) {
                this.detection.startDetection();
            }
        });

        // Add skill tree button to collection screen
        const collectionHeader = document.querySelector('.collection-header');
        if (collectionHeader) {
            const skillTreeBtn = document.createElement('button');
            skillTreeBtn.textContent = '🌳 Skills';
            skillTreeBtn.className = 'control-btn secondary';
            skillTreeBtn.onclick = () => this.showSkillTree();
            collectionHeader.appendChild(skillTreeBtn);
        }
    }

    loadDailyChallenges() {
        const today = new Date().toDateString();
        const savedChallenges = localStorage.getItem(`dailyChallenges_${today}`);
        
        if (savedChallenges) {
            this.dailyChallenges = JSON.parse(savedChallenges);
        } else {
            this.dailyChallenges = this.challenges.generateDailyChallenge();
            localStorage.setItem(`dailyChallenges_${today}`, JSON.stringify(this.dailyChallenges));
        }
        
        this.ui.updateChallenges(this.dailyChallenges);
    }

    async captureDiscovery() {
        if (!this.camera.isReady()) {
            this.ui.showNotification('Camera is not ready. Please wait a moment.', 'warning');
            return;
        }

        const currentDetection = this.detection.getCurrentDetection();
        if (!currentDetection) {
            this.ui.showNotification('No species detected. Please wait for detection.', 'warning');
            return;
        }

        // Capture photo
        const photo = this.camera.capturePhoto();
        if (!photo) {
            this.ui.showNotification('Failed to capture photo. Please try again.', 'error');
            return;
        }

        // Determine rarity based on detection engine and weather
        const rarity = this.determineRarity(currentDetection);
        
        // Apply weather bonus
        const weatherResult = this.weather.applyWeatherBonus(
            currentDetection.species,
            currentDetection.adjustedPoints,
            rarity
        );

        // Calculate XP with bonuses
        const gameData = this.storage.getGameData();
        const bonuses = this.calculateBonuses(gameData);
        const xp = this.progression.calculateXP(weatherResult.points, weatherResult.rarity, bonuses);

        // Save discovery with enhanced data
        const enhancedDiscovery = {
            species: currentDetection.species,
            points: weatherResult.points,
            xp: xp,
            photo: photo,
            confidence: currentDetection.confidence,
            rarity: weatherResult.rarity,
            location: this.weather.getLocationString(),
            weather: this.weather.weatherData?.condition || 'unknown',
            timestamp: new Date().toISOString()
        };

        const result = this.storage.addDiscovery(
            enhancedDiscovery.species,
            enhancedDiscovery.points,
            enhancedDiscovery.photo,
            enhancedDiscovery.confidence
        );

        if (result) {
            // Add XP to user profile
            gameData.userProfile.totalXP = (gameData.userProfile.totalXP || 0) + xp;
            this.storage.saveGameData(gameData);

            // Update challenges
            const challengeResult = this.challenges.updateChallengeProgress(this.dailyChallenges, enhancedDiscovery);
            this.dailyChallenges = challengeResult.updatedChallenges;
            
            // Save updated challenges
            const today = new Date().toDateString();
            localStorage.setItem(`dailyChallenges_${today}`, JSON.stringify(this.dailyChallenges));

            // Check achievements
            const newAchievements = this.progression.checkAchievements(gameData);

            // Update all UI
            this.updateAllUI();

            // Show notifications
            this.ui.showNotification(
                `${enhancedDiscovery.species} captured! +${enhancedDiscovery.points} pts, +${xp} XP`,
                weatherResult.rarity === 'common' ? 'success' : 'achievement',
                3000
            );

            if (weatherResult.weatherBonus) {
                this.ui.showNotification(`Weather bonus applied! ${weatherResult.weatherBonus}`, 'info', 2000);
            }

            // Show completed challenges
            challengeResult.completedChallenges.forEach(challenge => {
                this.ui.showNotification(`Challenge completed: ${challenge.name}!`, 'achievement', 4000);
            });

            // Show new achievements
            newAchievements.forEach(achievement => {
                this.ui.showAchievementUnlocked(achievement);
                gameData.userProfile.totalPoints += achievement.points;
            });

            // Show success modal
            this.showDiscoveryModal(result.discovery, result.isNewSpecies, enhancedDiscovery);

            // Update streaks
            this.updateStreaks(enhancedDiscovery.confidence);

            // Brief pause in detection after capture
            this.detection.stopDetection();
            setTimeout(() => {
                if (this.isGameActive && this.camera.isReady()) {
                    this.detection.startDetection();
                }
            }, 3000);
        }
    }

    determineRarity(detection) {
        const raritySystem = this.progression.raritySystem;
        const random = Math.random();
        
        // Base rarity chances
        let cumulativeChance = 0;
        for (const [rarity, data] of Object.entries(raritySystem)) {
            cumulativeChance += data.dropRate;
            if (random <= cumulativeChance) {
                return rarity;
            }
        }
        
        return 'common'; // Fallback
    }

    calculateBonuses(gameData) {
        const bonuses = {};
        
        // Weather bonus
        const weatherEffect = this.weather.getCurrentWeatherEffect();
        if (weatherEffect) {
            bonuses.weatherBonus = true;
        }
        
        // Streak bonus
        bonuses.streakBonus = Math.min(2.0, 1.0 + (this.streakData.daily * 0.1));
        
        // TODO: Add skill tree bonuses when implemented
        
        return bonuses;
    }

    updateStreaks(confidence) {
        // Daily streak
        const today = new Date().toDateString();
        const lastPlayDate = localStorage.getItem('lastPlayDate');
        
        if (lastPlayDate !== today) {
            this.streakData.daily += 1;
            localStorage.setItem('lastPlayDate', today);
            localStorage.setItem('dailyStreak', this.streakData.daily.toString());
        }
        
        // Perfect streak
        if (confidence >= 90) {
            this.streakData.perfect += 1;
            this.streakData.lastPerfectConfidence = confidence;
        } else {
            this.streakData.perfect = 0;
        }
    }

    updateAllUI() {
        this.updateUserStats();
        this.ui.updateProgressBar();
        this.ui.updateChallenges(this.dailyChallenges);
        this.renderCollection();
    }

    showDiscoveryModal(discovery, isNewSpecies, enhancedData) {
        const modal = document.getElementById('successModal');
        const discoveredCard = document.getElementById('discoveredCard');
        
        const rarityClass = enhancedData.rarity || 'common';
        const rarityBadge = `<div class="rarity-badge ${rarityClass}">${enhancedData.rarity.toUpperCase()}</div>`;
        
        discoveredCard.innerHTML = `
            <div class="species-card ${rarityClass}" style="position: relative;">
                ${rarityBadge}
                <img src="${discovery.photo}" alt="${discovery.species}" class="card-image">
                <div class="card-info">
                    <h4>${discovery.species}</h4>
                    <div class="card-stats">
                        <span style="color: #27ae60; font-weight: bold;">+${enhancedData.points} points</span>
                        <span style="color: #3498db; font-weight: bold;">+${enhancedData.xp} XP</span>
                    </div>
                    <div class="card-stats">
                        <span>${enhancedData.confidence}% confidence</span>
                        <span>${isNewSpecies ? '🆕 New Species!' : '📸 Captured Again'}</span>
                    </div>
                    <div class="card-stats">
                        <span>📍 ${enhancedData.location}</span>
                        <span>🌤️ ${enhancedData.weather}</span>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
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

        cardsGrid.innerHTML = collection.map(discovery => {
            const rarity = discovery.rarity || 'common';
            return `
                <div class="species-card ${rarity}" style="position: relative;">
                    <div class="rarity-badge ${rarity}">${rarity.toUpperCase()}</div>
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
                        ${discovery.location ? `<div class="card-stats"><span>📍 ${discovery.location}</span></div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    showSkillTree() {
        // TODO: Implement skill tree modal
        this.ui.showNotification('Skill Tree coming soon!', 'info');
    }

    startPeriodicUpdates() {
        // Update weather every hour
        setInterval(async () => {
            if (this.weather.shouldRefreshWeather()) {
                await this.weather.fetchWeatherData();
                this.ui.updateWeatherWidget(this.weather.weatherData);
            }
        }, 60 * 60 * 1000); // 1 hour
        
        // Check for new daily challenges at midnight
        setInterval(() => {
            const today = new Date().toDateString();
            const savedDate = localStorage.getItem('lastChallengeDate');
            if (savedDate !== today) {
                this.loadDailyChallenges();
                this.ui.showNotification('New daily challenges available!', 'info');
            }
        }, 60 * 60 * 1000); // Check every hour
    }

    // Existing methods remain the same...
    checkCameraSupport() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.ui.showNotification('Camera access is not supported in this browser.', 'error');
            document.getElementById('startCameraBtn').disabled = true;
        }
    }

    async startGame() {
        console.log('Starting enhanced game...');
        
        const cameraStarted = await this.camera.startCamera();
        
        if (cameraStarted) {
            this.isGameActive = true;
            
            this.camera.video.addEventListener('loadeddata', () => {
                this.detection.startDetection();
                this.ui.showNotification('Camera active! Start exploring!', 'success');
            });
        }
    }

    stopGame() {
        this.isGameActive = false;
        this.detection.stopDetection();
        this.camera.stopCamera();
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
        
        if (this.isGameActive) {
            this.detection.stopDetection();
        }
        
        this.renderCollection();
    }

    showGame() {
        this.currentScreen = 'game';
        document.getElementById('collectionScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        
        if (this.isGameActive && this.camera.isReady()) {
            this.detection.startDetection();
        }
    }

    closeModal() {
        document.getElementById('successModal').style.display = 'none';
    }

    getSpeciesCategory(speciesName) {
        const species = this.detection.getSpeciesByName(speciesName);
        return species ? species.category : 'unknown';
    }

    // Debug methods
    resetGame() {
        this.storage.resetGameData();
        localStorage.clear();
        this.updateAllUI();
        this.ui.showNotification('Game data reset successfully!', 'success');
    }

    exportData() {
        const data = {
            gameData: this.storage.exportData(),
            challenges: this.dailyChallenges,
            streaks: this.streakData,
            weather: this.weather.weatherData
        };
        console.log('Complete Game Data Export:', data);
        return data;
    }
}

// Initialize the enhanced game
document.addEventListener('DOMContentLoaded', () => {
    window.game = new InsectDetectionGame();
    
    // Debug console commands
    window.resetGame = () => window.game.resetGame();
    window.exportData = () => window.game.exportData();
    window.addXP = (amount) => {
        const gameData = window.game.storage.getGameData();
        gameData.userProfile.totalXP = (gameData.userProfile.totalXP || 0) + amount;
        window.game.storage.saveGameData(gameData);
        window.game.updateAllUI();
        window.game.ui.showNotification(`Added ${amount} XP!`, 'success');
    };
    
    console.log('🔍 Enhanced Nature Detective Game Loaded!');
    console.log('Debug commands: resetGame(), exportData(), addXP(amount)');
});
