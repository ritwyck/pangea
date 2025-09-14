// Complete Enhanced InsectDetectionGame class - Replace existing app.js
class InsectDetectionGame {
    constructor() {
        this.camera = new CameraManager();
        this.storage = new StorageManager();
        this.detection = new DetectionEngine();
        this.progression = new ProgressionSystem();
        this.challenges = new ChallengeSystem();
        this.weather = new WeatherSystem();
        this.community = new CommunitySystem();
        this.mapping = new MappingSystem();
        this.rewards = new RewardsIntegration();
        this.dataExport = new DataExportSystem();
        this.ui = new EnhancedUI(this);
        
        this.isGameActive = false;
        this.currentScreen = 'game';
        this.dailyChallenges = [];
        this.streakData = { daily: 0, perfect: 0, lastPerfectConfidence: 0 };
        
        this.initializeApp();
    }

    async initializeApp() {
        console.log('Initializing Complete Enhanced Insect Detection Game...');
        
        // Load community data
        this.loadCommunityData();
        
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
        
        // Add reset button
        this.createResetButton();
        
        // Check if user needs to register with neighborhood
        if (!this.community.userNeighborhood) {
            setTimeout(() => this.showCommunityRegistration(), 2000);
        }
        
        this.ui.showNotification('🌟 Welcome to Complete Nature Detective!', 'success', 4000);
        console.log('Complete enhanced game initialized successfully');
    }

    loadCommunityData() {
        // Load user neighborhood data
        const savedNeighborhood = localStorage.getItem('userNeighborhood');
        if (savedNeighborhood) {
            this.community.userNeighborhood = JSON.parse(savedNeighborhood);
        }
        
        // Load neighborhoods data
        const savedNeighborhoods = localStorage.getItem('neighborhoods');
        if (savedNeighborhoods) {
            this.community.neighborhoods = JSON.parse(savedNeighborhoods);
        }
        
        // Load community pool data
        const savedCommunityPool = localStorage.getItem('communityPool');
        if (savedCommunityPool) {
            this.community.communityPool = JSON.parse(savedCommunityPool);
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

    createResetButton() {
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '🔄 Reset Game';
        resetBtn.className = 'reset-game-btn';
        resetBtn.title = 'Reset all game data';
        resetBtn.onclick = () => this.confirmResetGame();
        document.body.appendChild(resetBtn);
    }

    confirmResetGame() {
        if (confirm('Are you sure you want to reset all game data? This action cannot be undone.')) {
            this.resetGame();
        }
    }

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

    showCommunityRegistration() {
        const modal = document.createElement('div');
        modal.id = 'communityModal';
        modal.className = 'modal community-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>🏘️ Join Your Neighborhood</h2>
                <p>Connect with your local community to earn collective points and unlock community rewards!</p>
                
                <input type="text" id="usernameInput" class="username-input" placeholder="Enter your username" maxlength="20">
                
                <div class="neighborhood-selector" id="neighborhoodSelector">
                    ${this.community.neighborhoods.map(n => `
                        <div class="neighborhood-option" data-id="${n.id}">
                            <div class="neighborhood-info">
                                <h4>${n.name}</h4>
                                <div class="neighborhood-stats">
                                    <span>👥 ${n.memberCount} members</span>
                                    <span>🏆 ${n.totalPoints.toLocaleString()} points</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="modal-buttons">
                    <button class="modal-btn" id="registerBtn" disabled>Join Community</button>
                    <button class="modal-btn secondary" id="skipBtn">Skip for Now</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';

        let selectedNeighborhood = null;
        
        // Handle neighborhood selection
        document.querySelectorAll('.neighborhood-option').forEach(option => {
            option.onclick = () => {
                document.querySelectorAll('.neighborhood-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                selectedNeighborhood = option.dataset.id;
                this.updateRegisterButton();
            };
        });

        // Handle username input
        const usernameInput = document.getElementById('usernameInput');
        usernameInput.oninput = () => this.updateRegisterButton();

        // Register button
        document.getElementById('registerBtn').onclick = () => {
            const username = usernameInput.value.trim();
            if (username && selectedNeighborhood) {
                this.community.registerWithNeighborhood(selectedNeighborhood, username);
                modal.remove();
                this.ui.showNotification(`Welcome to ${this.community.userNeighborhood.name}!`, 'success', 4000);
                this.updateAllUI();
            }
        };

        // Skip button
        document.getElementById('skipBtn').onclick = () => {
            modal.remove();
        };

        // Update register button function
        this.updateRegisterButton = () => {
            const username = usernameInput.value.trim();
            const registerBtn = document.getElementById('registerBtn');
            registerBtn.disabled = !username || !selectedNeighborhood;
        };
    }

    bindEventListeners() {
        // Basic game controls
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

        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isGameActive) {
                this.detection.stopDetection();
            } else if (!document.hidden && this.isGameActive && this.camera.isReady()) {
                this.detection.startDetection();
            }
        });

        // Enhanced navigation buttons
        const collectionHeader = document.querySelector('.collection-header');
        if (collectionHeader) {
            // Community Dashboard button
            const communityBtn = document.createElement('button');
            communityBtn.textContent = '🏘️ Community';
            communityBtn.className = 'control-btn secondary';
            communityBtn.onclick = () => this.showCommunityDashboard();
            collectionHeader.appendChild(communityBtn);
            
            // Map button
            const mapBtn = document.createElement('button');
            mapBtn.textContent = '🗺️ Map';
            mapBtn.className = 'control-btn secondary';
            mapBtn.onclick = () => this.mapping.showMap();
            collectionHeader.appendChild(mapBtn);

            // Skill tree button
            const skillTreeBtn = document.createElement('button');
            skillTreeBtn.textContent = '🌳 Skills';
            skillTreeBtn.className = 'control-btn secondary';
            skillTreeBtn.onclick = () => this.showSkillTree();
            collectionHeader.appendChild(skillTreeBtn);

            // Rewards button
            const rewardsBtn = document.createElement('button');
            rewardsBtn.textContent = '🎁 Rewards';
            rewardsBtn.className = 'control-btn secondary';
            rewardsBtn.onclick = () => this.ui.showRewards();
            collectionHeader.appendChild(rewardsBtn);
            
            // Data Export button
            const exportBtn = document.createElement('button');
            exportBtn.textContent = '📊 Export Data';
            exportBtn.className = 'control-btn secondary';
            exportBtn.onclick = () => this.ui.showDataExport();
            collectionHeader.appendChild(exportBtn);
        }
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

    // Capture photo - THIS IS THE KEY LINE
    const photo = this.camera.capturePhoto();
    if (!photo) {
        this.ui.showNotification('Failed to capture photo. Please try again.', 'error');
        return;
    }


        // Get current location for mapping
        let currentLocation = null;
        try {
            currentLocation = await this.weather.getCurrentLocation();
        } catch (error) {
            console.warn('Could not get current location for mapping');
        }

    

        // Determine rarity and apply weather bonus
        const rarity = this.determineRarity(currentDetection);
        const weatherResult = this.weather.applyWeatherBonus(
            currentDetection.species,
            currentDetection.adjustedPoints,
            rarity
        );

        // Calculate XP with bonuses
        const gameData = this.storage.getGameData();
        const bonuses = this.calculateBonuses(gameData);
        const xp = this.progression.calculateXP(weatherResult.points, weatherResult.rarity, bonuses);

        // Enhanced discovery with location data
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

        // Save discovery
   const result = this.storage.addDiscovery(
        enhancedDiscovery.species,
        enhancedDiscovery.points,
        photo,  // ← Make sure this photo variable is passed here
        enhancedDiscovery.confidence
    );
        if (result) {
            // Add to mapping system
            if (currentLocation) {
                this.mapping.addDiscovery(enhancedDiscovery, currentLocation.latitude, currentLocation.longitude);
            }

            // Add XP to user profile
            gameData.userProfile.totalXP = (gameData.userProfile.totalXP || 0) + xp;
            this.storage.saveGameData(gameData);

            // Contribute to community points
            if (this.community.userNeighborhood) {
                this.community.contributePoints(weatherResult.points);
            }

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

            if (this.community.userNeighborhood) {
                this.ui.showNotification(`+${weatherResult.points} points contributed to ${this.community.userNeighborhood.name}!`, 'info', 2000);
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
        
        let cumulativeChance = 0;
        for (const [rarity, data] of Object.entries(raritySystem)) {
            cumulativeChance += data.dropRate;
            if (random <= cumulativeChance) {
                return rarity;
            }
        }
        
        return 'common';
    }

    calculateBonuses(gameData) {
        const bonuses = {};
        
        const weatherEffect = this.weather.getCurrentWeatherEffect();
        if (weatherEffect) {
            bonuses.weatherBonus = true;
        }
        
        bonuses.streakBonus = Math.min(2.0, 1.0 + (this.streakData.daily * 0.1));
        
        return bonuses;
    }

    updateStreaks(confidence) {
        const today = new Date().toDateString();
        const lastPlayDate = localStorage.getItem('lastPlayDate');
        
        if (lastPlayDate !== today) {
            this.streakData.daily += 1;
            localStorage.setItem('lastPlayDate', today);
            localStorage.setItem('dailyStreak', this.streakData.daily.toString());
        }
        
        if (confidence >= 90) {
            this.streakData.perfect += 1;
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

    updateUserStats() {
        const profile = this.storage.getUserProfile();
        if (profile) {
            document.getElementById('totalPoints').textContent = profile.totalPoints;
            document.getElementById('totalDiscoveries').textContent = this.storage.getUniqueSpeciesCount();
        }
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

    getSpeciesCategory(speciesName) {
        const species = this.detection.getSpeciesByName(speciesName);
        return species ? species.category : 'unknown';
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

    showSkillTree() {
        this.ui.showNotification('Skill Tree coming soon!', 'info');
    }

    startPeriodicUpdates() {
        // Update weather every hour
        setInterval(async () => {
            if (this.weather.shouldRefreshWeather()) {
                await this.weather.fetchWeatherData();
                this.ui.updateWeatherWidget(this.weather.weatherData);
            }
        }, 60 * 60 * 1000);
        
        // Check for new daily challenges at midnight
        setInterval(() => {
            const today = new Date().toDateString();
            const savedDate = localStorage.getItem('lastChallengeDate');
            if (savedDate !== today) {
                this.loadDailyChallenges();
                this.ui.showNotification('New daily challenges available!', 'info');
            }
        }, 60 * 60 * 1000);
    }

    // Community Dashboard methods (keeping your existing ones)
    showCommunityDashboard() {
        const modal = document.createElement('div');
        modal.id = 'communityDashboardModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 90vw; max-height: 90vh; overflow-y: auto;">
                <div class="community-dashboard">
                    <div class="dashboard-header">
                        <h2>🏘️ Community Dashboard</h2>
                        <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                    </div>
                    
                    ${this.renderCommunityStats()}
                    ${this.renderCommunityGoals()}
                    ${this.renderLeaderboards()}
                    ${this.renderRedemptionCenter()}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';

        this.bindRedemptionButtons();
    }

    renderCommunityStats() {
        const stats = this.community.getCommunityStats();
        const userRank = this.community.getUserRankInNeighborhood();

        return `
            <div class="community-stats">
                <div class="stat-card community">
                    <div class="stat-value">${stats.totalCommunityPoints.toLocaleString()}</div>
                    <div class="stat-label">Total Community Points</div>
                </div>
                <div class="stat-card community">
                    <div class="stat-value">${stats.totalMembers}</div>
                    <div class="stat-label">Active Members</div>
                </div>
                <div class="stat-card neighborhood">
                    <div class="stat-value">#${stats.userNeighborhoodRank || 'N/A'}</div>
                    <div class="stat-label">Neighborhood Rank</div>
                </div>
                <div class="stat-card personal">
                    <div class="stat-value">${stats.userContribution.toLocaleString()}</div>
                    <div class="stat-label">Your Contribution</div>
                </div>
                ${userRank ? `
                <div class="stat-card personal">
                    <div class="stat-value">#${userRank.rank}</div>
                    <div class="stat-label">Your Local Rank</div>
                </div>` : ''}
            </div>
        `;
    }

    renderCommunityGoals() {
        return `
            <div class="community-goals">
                <h3>🎯 Community Goals</h3>
                ${this.community.communityPool.communityGoals.map(goal => {
                    const progress = Math.min(100, (goal.currentPoints / goal.targetPoints) * 100);
                    const deadline = new Date(goal.deadline).toLocaleDateString();
                    
                    return `
                        <div class="goal-item">
                            <div class="goal-header">
                                <h4>${goal.name}</h4>
                                <span class="deadline">Deadline: ${deadline}</span>
                            </div>
                            <p>${goal.description}</p>
                            <div class="goal-progress">
                                <div class="goal-progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <div class="progress-text">
                                ${goal.currentPoints.toLocaleString()} / ${goal.targetPoints.toLocaleString()} points (${Math.round(progress)}%)
                            </div>
                            <div class="goal-rewards">
                                ${goal.rewards.map(reward => `
                                    <div class="reward-card ${reward.type}">
                                        <h5>${reward.type === 'individual' ? '🏆 Individual' : '🏘️ Community'}</h5>
                                        <p>${reward.reward}</p>
                                        <small>${reward.cost.toLocaleString()} points</small>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderLeaderboards() {
        const neighborhoodLeaderboard = this.community.getNeighborhoodLeaderboard();
        const userRank = this.community.getUserRankInNeighborhood();

        return `
            <div class="leaderboard-container">
                <div class="leaderboard-header">
                    <h3>🏆 Leaderboards</h3>
                </div>
                
                <h4>Neighborhood Rankings</h4>
                <div class="leaderboard-list">
                    ${neighborhoodLeaderboard.slice(0, 5).map(neighborhood => `
                        <div class="leaderboard-item ${neighborhood.id === this.community.userNeighborhood?.id ? 'current-user' : ''} rank-${neighborhood.rank}">
                            <div class="rank-badge rank-${neighborhood.rank}">${neighborhood.rank}</div>
                            <div class="member-info">
                                <div class="member-name">${neighborhood.name}</div>
                                <div class="member-stats">
                                    <span>👥 ${neighborhood.memberCount} members</span>
                                    <span>🏆 ${neighborhood.totalPoints.toLocaleString()} pts</span>
                                    <span>📈 ${neighborhood.avgPointsPerMember} avg</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                ${userRank ? `
                    <h4>Your Neighborhood Top Players</h4>
                    <div class="leaderboard-list">
                        ${userRank.topMembers.slice(0, 5).map((member, index) => `
                            <div class="leaderboard-item ${member.isCurrentUser ? 'current-user' : ''} rank-${index + 1}">
                                <div class="rank-badge rank-${index + 1}">${index + 1}</div>
                                <div class="member-info">
                                    <div class="member-name">${member.username}</div>
                                    <div class="member-stats">
                                        <span>🏆 ${member.points.toLocaleString()} pts</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderRedemptionCenter() {
        const userProfile = this.storage.getUserProfile();
        const userPoints = userProfile ? userProfile.totalPoints : 0;
        const neighborhoodPoints = this.community.userNeighborhood ? 
            this.community.neighborhoods.find(n => n.id === this.community.userNeighborhood.id)?.totalPoints || 0 : 0;

        return `
            <div class="redemption-container">
                <div class="redemption-section">
                    <div class="section-header">
                        <h3>🏆 Individual Rewards</h3>
                        <span class="available-points">${userPoints.toLocaleString()} pts</span>
                    </div>
                    <div class="redemption-list">
                        ${this.community.communityPool.individualRedemptions.map(item => `
                            <div class="redemption-item ${userPoints >= item.cost ? 'affordable' : ''}">
                                <div class="redemption-header">
                                    <h4>${item.name}</h4>
                                    <span class="redemption-cost">${item.cost} pts</span>
                                </div>
                                <p class="redemption-description">${item.description}</p>
                                <button class="redeem-btn" data-type="individual" data-id="${item.id}" 
                                        ${userPoints < item.cost ? 'disabled' : ''}>
                                    ${userPoints >= item.cost ? 'Redeem Now' : 'Not Enough Points'}
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="redemption-section">
                    <div class="section-header">
                        <h3>🏘️ Community Rewards</h3>
                        <span class="available-points">${neighborhoodPoints.toLocaleString()} pts</span>
                    </div>
                    <div class="redemption-list">
                        ${this.community.communityPool.communityRedemptions.map(item => `
                            <div class="redemption-item ${neighborhoodPoints >= item.cost ? 'affordable' : ''}">
                                <div class="redemption-header">
                                    <h4>${item.name}</h4>
                                    <span class="redemption-cost">${item.cost} pts</span>
                                </div>
                                <p class="redemption-description">${item.description}</p>
                                <button class="redeem-btn" data-type="community" data-id="${item.id}" 
                                        ${neighborhoodPoints < item.cost || !this.community.userNeighborhood ? 'disabled' : ''}>
                                    ${!this.community.userNeighborhood ? 'Join Neighborhood First' : 
                                      neighborhoodPoints >= item.cost ? 'Redeem for Community' : 'Not Enough Points'}
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    bindRedemptionButtons() {
        document.querySelectorAll('.redeem-btn').forEach(btn => {
            btn.onclick = () => {
                if (btn.disabled) return;
                
                const type = btn.dataset.type;
                const id = btn.dataset.id;
                
                if (confirm(`Are you sure you want to redeem this ${type} reward?`)) {
                    let success = false;
                    
                    if (type === 'individual') {
                        success = this.community.redeemIndividual(id);
                    } else {
                        success = this.community.redeemCommunity(id);
                    }
                    
                    if (success) {
                        this.ui.showNotification(`${type} reward redeemed successfully!`, 'success');
                        this.updateAllUI();
                        document.getElementById('communityDashboardModal')?.remove();
                        setTimeout(() => this.showCommunityDashboard(), 100);
                    } else {
                        this.ui.showNotification('Failed to redeem reward. Please try again.', 'error');
                    }
                }
            };
        });
    }

    resetGame() {
        localStorage.clear();
        
        this.storage.resetGameData();
        this.community = new CommunitySystem();
        this.mapping = new MappingSystem();
        this.dailyChallenges = [];
        this.streakData = { daily: 0, perfect: 0, lastPerfectConfidence: 0 };
        
        this.updateAllUI();
        this.ui.showNotification('🔄 Game completely reset!', 'success', 4000);
        
        setTimeout(() => this.showCommunityRegistration(), 2000);
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

// Initialize the complete enhanced game
document.addEventListener('DOMContentLoaded', () => {
    // Load Leaflet assets for mapping
    if (!document.querySelector('link[href*="leaflet"]')) {
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletJS.onload = () => {
            window.game = new InsectDetectionGame();
        };
        document.head.appendChild(leafletJS);
    } else {
        window.game = new InsectDetectionGame();
    }
    
    // Enhanced debug console commands
    window.resetGame = () => window.game.resetGame();
    window.exportData = () => window.game.exportData();
    window.addXP = (amount) => {
        const gameData = window.game.storage.getGameData();
        gameData.userProfile.totalXP = (gameData.userProfile.totalXP || 0) + amount;
        window.game.storage.saveGameData(gameData);
        window.game.updateAllUI();
        window.game.ui.showNotification(`Added ${amount} XP!`, 'success');
    };
    window.joinNeighborhood = (id, username) => {
        window.game.community.registerWithNeighborhood(id, username);
        window.game.updateAllUI();
        window.game.ui.showNotification(`Joined neighborhood!`, 'success');
    };
    window.showMap = () => window.game.mapping.showMap();
    window.addCommunityPoints = (points) => {
        window.game.community.contributePoints(points);
        window.game.ui.showNotification(`Added ${points} community points!`, 'success');
    };
    
    console.log('🔍 Complete Enhanced Nature Detective Game Loaded!');
    console.log('Debug commands: resetGame(), exportData(), addXP(amount), joinNeighborhood(id, username), showMap(), addCommunityPoints(amount)');
});
