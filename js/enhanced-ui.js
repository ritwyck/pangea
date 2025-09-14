class EnhancedUI {
    constructor(game) {
        this.game = game;
        this.notifications = [];
        this.animationQueue = [];
        this.initializeUI();
    }

    initializeUI() {
        this.createProgressBar();
        this.createNotificationSystem();
        this.createAchievementModal();
        this.createChallengePanel();
        this.createWeatherWidget();
        this.createSkillTreeModal();
    }

    createProgressBar() {
        const navContent = document.querySelector('.nav-content');
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = `
            <div class="level-info">
                <span class="level-badge">Lv. <span id="playerLevel">1</span></span>
                <span class="level-title" id="playerTitle">Curious Observer</span>
            </div>
            <div class="xp-bar">
                <div class="xp-fill" id="xpFill"></div>
                <span class="xp-text"><span id="currentXP">0</span> / <span id="requiredXP">100</span> XP</span>
            </div>
        `;
        
        navContent.appendChild(progressContainer);
        this.updateProgressBar();
    }

    createNotificationSystem() {
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    createAchievementModal() {
        const modal = document.createElement('div');
        modal.id = 'achievementModal';
        modal.className = 'modal achievement-modal';
        modal.innerHTML = `
            <div class="modal-content achievement-content">
                <h2>🏆 Achievement Unlocked!</h2>
                <div class="achievement-display" id="achievementDisplay">
                    <!-- Achievement details will be inserted here -->
                </div>
                <button class="modal-btn" id="closeAchievementBtn">Awesome!</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('closeAchievementBtn').addEventListener('click', () => {
            this.closeAchievementModal();
        });
    }

    createChallengePanel() {
        const gameScreen = document.getElementById('gameScreen');
        const challengePanel = document.createElement('div');
        challengePanel.id = 'challengePanel';
        challengePanel.className = 'challenge-panel collapsed';
        challengePanel.innerHTML = `
            <div class="challenge-header" onclick="this.parentElement.classList.toggle('collapsed')">
                <h3>📅 Daily Challenges</h3>
                <span class="collapse-arrow">▼</span>
            </div>
            <div class="challenge-list" id="challengeList">
                <!-- Challenges will be populated here -->
            </div>
        `;
        
        gameScreen.appendChild(challengePanel);
    }

    createWeatherWidget() {
        const cameraContainer = document.querySelector('.camera-container');
        const weatherWidget = document.createElement('div');
        weatherWidget.id = 'weatherWidget';
        weatherWidget.className = 'weather-widget';
        weatherWidget.innerHTML = `
            <div class="weather-icon" id="weatherIcon">⛅</div>
            <div class="weather-info">
                <div class="weather-temp" id="weatherTemp">--°C</div>
                <div class="weather-condition" id="weatherCondition">Loading...</div>
            </div>
            <div class="weather-bonus" id="weatherBonus" style="display: none;">
                <span class="bonus-text">Weather Bonus Active!</span>
            </div>
        `;
        
        cameraContainer.appendChild(weatherWidget);
    }

    createSkillTreeModal() {
        const modal = document.createElement('div');
        modal.id = 'skillTreeModal';
        modal.className = 'modal skill-tree-modal';
        modal.innerHTML = `
            <div class="modal-content skill-tree-content">
                <div class="modal-header">
                    <h2>🌳 Skill Tree</h2>
                    <button class="close-btn" onclick="this.closest('.modal').style.display='none'">×</button>
                </div>
                <div class="skill-points">
                    Available Skill Points: <span id="availableSkillPoints">0</span>
                </div>
                <div class="skill-categories" id="skillCategories">
                    <!-- Skill tree will be populated here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    updateProgressBar() {
        const gameData = this.game.storage.getGameData();
        if (!gameData) return;

        const progression = this.game.progression;
        const currentLevel = this.calculateLevel(gameData.userProfile.totalXP || 0);
        const levelData = progression.levels[currentLevel - 1];
        const nextLevelData = progression.levels[currentLevel];

        document.getElementById('playerLevel').textContent = currentLevel;
        document.getElementById('playerTitle').textContent = levelData?.title || 'Explorer';

        if (nextLevelData) {
            const currentXP = gameData.userProfile.totalXP || 0;
            const previousLevelXP = levelData?.xpRequired || 0;
            const nextLevelXP = nextLevelData.xpRequired;
            const progressXP = currentXP - previousLevelXP;
            const neededXP = nextLevelXP - previousLevelXP;

            document.getElementById('currentXP').textContent = progressXP;
            document.getElementById('requiredXP').textContent = neededXP;

            const percentage = Math.min(100, (progressXP / neededXP) * 100);
            document.getElementById('xpFill').style.width = percentage + '%';
        }
    }

    updateWeatherWidget(weatherData) {
        if (!weatherData) return;

        const weatherEffect = this.game.weather.getCurrentWeatherEffect();
        if (weatherEffect) {
            document.getElementById('weatherIcon').textContent = weatherEffect.icon;
            document.getElementById('weatherTemp').textContent = `${weatherData.temperature}°C`;
            document.getElementById('weatherCondition').textContent = weatherEffect.name;
            
            const bonusElement = document.getElementById('weatherBonus');
            if (weatherEffect.bonusSpecies.length > 0) {
                bonusElement.style.display = 'block';
                bonusElement.title = `Bonus for: ${weatherEffect.bonusSpecies.join(', ')}`;
            } else {
                bonusElement.style.display = 'none';
            }
        }
    }

    updateChallenges(challenges) {
        const challengeList = document.getElementById('challengeList');
        if (!challenges || challenges.length === 0) {
            challengeList.innerHTML = '<div class="no-challenges">No challenges available</div>';
            return;
        }

        challengeList.innerHTML = challenges.map(challenge => `
            <div class="challenge-item ${challenge.completed ? 'completed' : ''}">
                <div class="challenge-info">
                    <h4>${challenge.name}</h4>
                    <p>${challenge.description}</p>
                </div>
                <div class="challenge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.getChallengeProgress(challenge)}%"></div>
                    </div>
                    <span class="progress-text">${challenge.progress || 0} / ${this.getChallengeTarget(challenge)}</span>
                </div>
                <div class="challenge-reward">
                    ${this.formatChallengeReward(challenge.reward)}
                </div>
            </div>
        `).join('');
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        const container = document.getElementById('notificationContainer');
        container.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => container.removeChild(notification), 300);
        }, duration);
    }

    showAchievementUnlocked(achievement) {
        const modal = document.getElementById('achievementModal');
        const display = document.getElementById('achievementDisplay');

        display.innerHTML = `
            <div class="achievement-badge">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-details">
                    <h3>${achievement.name}</h3>
                    <p>${achievement.description}</p>
                    <div class="achievement-reward">+${achievement.points} points</div>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        this.playAchievementAnimation();
    }

    playAchievementAnimation() {
        // Add sparkle effect or other animations
        const display = document.getElementById('achievementDisplay');
        display.classList.add('achievement-sparkle');
        
        setTimeout(() => {
            display.classList.remove('achievement-sparkle');
        }, 2000);
    }

    closeAchievementModal() {
        document.getElementById('achievementModal').style.display = 'none';
    }

    // Utility methods
    calculateLevel(totalXP) {
        for (let i = 0; i < this.game.progression.levels.length; i++) {
            if (totalXP < this.game.progression.levels[i].xpRequired) {
                return i + 1;
            }
        }
        return this.game.progression.levels.length;
    }

    getChallengeProgress(challenge) {
        const target = this.getChallengeTarget(challenge);
        return target > 0 ? Math.min(100, ((challenge.progress || 0) / target) * 100) : 0;
    }

    getChallengeTarget(challenge) {
        // Extract target from challenge ID or description
        const targets = {
            'daily_discover_3': 3,
            'daily_points_500': 500,
            'daily_confidence_80': 5,
            'daily_insects_only': 5,
            'daily_plants_only': 4,
            'daily_morning_bird': 3,
            'daily_night_owl': 2,
            'daily_perfect_streak': 3,
            'daily_speed_run': 5
        };
        return targets[challenge.id] || 1;
    }

    formatChallengeReward(reward) {
        const parts = [];
        if (reward.xp) parts.push(`${reward.xp} XP`);
        if (reward.points) parts.push(`${reward.points} pts`);
        if (reward.skill_point) parts.push(`${reward.skill_point} SP`);
        return parts.join(', ');
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            achievement: '🏆',
            levelup: '⬆️',
            rare: '💎'
        };
        return icons[type] || icons.info;
    }
    // Add these methods to the existing EnhancedUI class

createRewardsModal() {
    const modal = document.createElement('div');
    modal.id = 'rewardsModal';
    modal.className = 'modal rewards-modal';
    modal.innerHTML = `
        <div class="modal-content rewards-content">
            <div class="modal-header">
                <h2>🎁 Partner Rewards</h2>
                <div class="user-points">
                    Available: <span id="rewardsUserPoints">0</span> points
                </div>
                <button class="close-btn" onclick="this.closest('.modal').style.display='none'">×</button>
            </div>
            
            <div class="rewards-tabs">
                <button class="rewards-tab active" data-category="all">All Rewards</button>
                <button class="rewards-tab" data-category="transport">🚌 Transport</button>
                <button class="rewards-tab" data-category="food">☕ Food & Drink</button>
                <button class="rewards-tab" data-category="shopping">🛍️ Shopping</button>
                <button class="rewards-tab" data-category="experiences">🎭 Experiences</button>
                <button class="rewards-tab" data-category="vouchers">🎫 My Vouchers</button>
            </div>
            
            <div class="rewards-content-area" id="rewardsContentArea">
                <!-- Content will be populated here -->
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Bind tab events
    document.querySelectorAll('.rewards-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.rewards-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            this.updateRewardsContent(tab.dataset.category);
        };
    });
}

createDataExportModal() {
    const modal = document.createElement('div');
    modal.id = 'dataExportModal';
    modal.className = 'modal data-export-modal';
    modal.innerHTML = `
        <div class="modal-content export-content">
            <div class="modal-header">
                <h2>📊 Export Scientific Data</h2>
                <div class="export-subtitle">
                    Download anonymized biodiversity data for research and analysis
                </div>
                <button class="close-btn" onclick="this.closest('.modal').style.display='none'">×</button>
            </div>
            
            <div class="export-form" id="exportForm">
                <div class="form-section">
                    <h3>🔍 Data Filters</h3>
                    <div class="filter-grid">
                        <div class="filter-group">
                            <label>Species Selection:</label>
                            <div class="species-selector" id="speciesSelector">
                                <button class="select-all-btn" onclick="this.parentElement.querySelectorAll('input').forEach(cb => cb.checked = true)">Select All</button>
                                <button class="clear-all-btn" onclick="this.parentElement.querySelectorAll('input').forEach(cb => cb.checked = false)">Clear All</button>
                            </div>
                        </div>
                        
                        <div class="filter-group">
                            <label for="startDate">Start Date:</label>
                            <input type="date" id="startDate" class="date-input">
                        </div>
                        
                        <div class="filter-group">
                            <label for="endDate">End Date:</label>
                            <input type="date" id="endDate" class="date-input">
                        </div>
                        
                        <div class="filter-group">
                            <label>Weather Conditions:</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" value="sunny" checked> ☀️ Sunny</label>
                                <label><input type="checkbox" value="cloudy" checked> ☁️ Cloudy</label>
                                <label><input type="checkbox" value="rainy" checked> 🌧️ Rainy</label>
                                <label><input type="checkbox" value="overcast" checked> ⛅ Overcast</label>
                            </div>
                        </div>
                        
                        <div class="filter-group">
                            <label for="minConfidence">Minimum Confidence:</label>
                            <input type="range" id="minConfidence" min="0" max="100" value="60" class="confidence-slider">
                            <span class="confidence-value">60%</span>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3>🔒 Privacy & Anonymization</h3>
                    <div class="anonymization-grid">
                        <div class="privacy-group">
                            <label>Location Privacy:</label>
                            <select id="locationAnonymization">
                                <option value="precision_reduction">Reduced Precision (~100m)</option>
                                <option value="grid_snapping">Grid Snapping (~1km)</option>
                                <option value="area_generalization">District Level Only</option>
                            </select>
                            <small>Higher levels provide better privacy protection</small>
                        </div>
                        
                        <div class="privacy-group">
                            <label>Time Privacy:</label>
                            <select id="timeAnonymization">
                                <option value="hour_generalization">Hour Level</option>
                                <option value="day_generalization">Day Level</option>
                                <option value="season_generalization">Season Level</option>
                            </select>
                            <small>Reduces temporal precision for privacy</small>
                        </div>
                    </div>
                    
                    <div class="privacy-notice">
                        <strong>🛡️ Privacy Guarantee:</strong> All personal data (photos, usernames, exact locations) 
                        are automatically removed. Only species, general location, time, and environmental data are included.
                    </div>
                </div>
                
                <div class="form-section">
                    <h3>📁 Export Format</h3>
                    <div class="format-selector">
                        <label class="format-option">
                            <input type="radio" name="exportFormat" value="csv" checked>
                            <span class="format-label">
                                <strong>CSV</strong> - Spreadsheet compatible
                                <small>Best for Excel, Google Sheets, statistical analysis</small>
                            </span>
                        </label>
                        <label class="format-option">
                            <input type="radio" name="exportFormat" value="json">
                            <span class="format-label">
                                <strong>JSON</strong> - Structured data
                                <small>Best for programming, web applications, APIs</small>
                            </span>
                        </label>
                        <label class="format-option">
                            <input type="radio" name="exportFormat" value="geojson">
                            <span class="format-label">
                                <strong>GeoJSON</strong> - Geographic data
                                <small>Best for GIS software, mapping applications</small>
                            </span>
                        </label>
                    </div>
                </div>
                
                <div class="export-preview" id="exportPreview">
                    <!-- Preview will be populated here -->
                </div>
                
                <div class="export-actions">
                    <button class="preview-btn" id="previewDataBtn">📋 Preview Data</button>
                    <button class="export-btn" id="exportDataBtn">📥 Download Dataset</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Initialize export form
    this.initializeExportForm();
}

initializeExportForm() {
    const dataExport = this.game.dataExport;
    
    // Populate species selector
    const speciesSelector = document.getElementById('speciesSelector');
    const availableSpecies = dataExport.getAvailableSpecies();
    
    availableSpecies.forEach(species => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${species}" checked> ${species}`;
        speciesSelector.appendChild(label);
    });
    
    // Set date range limits
    const dateRange = dataExport.getDataDateRange();
    if (dateRange.earliest) {
        document.getElementById('startDate').value = dateRange.earliest;
        document.getElementById('startDate').min = dateRange.earliest;
    }
    if (dateRange.latest) {
        document.getElementById('endDate').value = dateRange.latest;
        document.getElementById('endDate').max = dateRange.latest;
    }
    
    // Confidence slider
    const confidenceSlider = document.getElementById('minConfidence');
    const confidenceValue = document.querySelector('.confidence-value');
    confidenceSlider.oninput = () => {
        confidenceValue.textContent = confidenceSlider.value + '%';
    };
    
    // Preview button
    document.getElementById('previewDataBtn').onclick = () => this.previewExportData();
    
    // Export button
    document.getElementById('exportDataBtn').onclick = () => this.executeDataExport();
}

showRewards() {
    if (!document.getElementById('rewardsModal')) {
        this.createRewardsModal();
    }
    
    const modal = document.getElementById('rewardsModal');
    const userProfile = this.game.storage.getUserProfile();
    document.getElementById('rewardsUserPoints').textContent = userProfile ? userProfile.totalPoints.toLocaleString() : '0';
    
    this.updateRewardsContent('all');
    modal.style.display = 'flex';
}

updateRewardsContent(category) {
    const contentArea = document.getElementById('rewardsContentArea');
    const rewards = this.game.rewards;
    
    if (category === 'vouchers') {
        this.showActiveVouchers(contentArea);
    } else {
        this.showRewardsCatalog(contentArea, category);
    }
}

showRewardsCatalog(container, category) {
    const allRewards = this.game.rewards.getAllRewards();
    const filteredRewards = category === 'all' ? allRewards : allRewards.filter(r => r.category === category);
    const userProfile = this.game.storage.getUserProfile();
    const userPoints = userProfile ? userProfile.totalPoints : 0;
    
    const groupedRewards = {};
    filteredRewards.forEach(reward => {
        if (!groupedRewards[reward.category]) {
            groupedRewards[reward.category] = [];
        }
        groupedRewards[reward.category].push(reward);
    });
    
    let html = '';
    Object.entries(groupedRewards).forEach(([cat, rewards]) => {
        const categoryIcons = {
            transport: '🚌',
            food: '☕',
            shopping: '🛍️',
            experiences: '🎭'
        };
        
        html += `
            <div class="reward-category">
                <h3>${categoryIcons[cat]} ${cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
                <div class="reward-grid">
                    ${rewards.map(reward => `
                        <div class="reward-card ${userPoints >= reward.cost ? 'affordable' : 'expensive'}">
                            <div class="reward-icon">${reward.icon}</div>
                            <div class="reward-details">
                                <h4>${reward.name}</h4>
                                <div class="reward-partner">${reward.partner}</div>
                                <div class="reward-description">${reward.description}</div>
                                <div class="reward-value">Value: ${reward.value}</div>
                                <div class="reward-availability">${reward.availability}</div>
                            </div>
                            <div class="reward-cost">${reward.cost.toLocaleString()} points</div>
                            <button class="redeem-reward-btn" 
                                    data-reward-id="${reward.id}" 
                                    ${userPoints < reward.cost ? 'disabled' : ''}>
                                ${userPoints >= reward.cost ? 'Redeem Now' : 'Not Enough Points'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Bind redeem buttons
    container.querySelectorAll('.redeem-reward-btn').forEach(btn => {
        btn.onclick = () => this.handleRewardRedemption(btn.dataset.rewardId);
    });
}

showActiveVouchers(container) {
    const activeVouchers = this.game.rewards.getActiveVouchers();
    const stats = this.game.rewards.getRedemptionStats();
    
    let html = `
        <div class="voucher-stats">
            <div class="stat-card">
                <div class="stat-value">${stats.activeVouchers}</div>
                <div class="stat-label">Active Vouchers</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalRedeemed}</div>
                <div class="stat-label">Total Redeemed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">€${stats.totalValue}</div>
                <div class="stat-label">Total Value</div>
            </div>
        </div>
        
        <div class="vouchers-list">
    `;
    
    if (activeVouchers.length === 0) {
        html += `
            <div class="no-vouchers">
                <h3>No Active Vouchers</h3>
                <p>Redeem rewards to get vouchers you can use at partner locations!</p>
            </div>
        `;
    } else {
        html += activeVouchers.map(voucher => {
            const expiresIn = Math.ceil((new Date(voucher.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
            return `
                <div class="voucher-card ${expiresIn <= 7 ? 'expiring-soon' : ''}">
                    <div class="voucher-header">
                        <h4>${voucher.rewardName}</h4>
                        <div class="voucher-code">${voucher.voucherCode}</div>
                    </div>
                    <div class="voucher-partner">${voucher.partner}</div>
                    <div class="voucher-expiry">
                        Expires in ${expiresIn} day${expiresIn !== 1 ? 's' : ''}
                        ${expiresIn <= 7 ? '<span class="warning">⚠️ Expiring Soon!</span>' : ''}
                    </div>
                    <div class="voucher-instructions">
                        ${voucher.instructions}
                    </div>
                    <div class="voucher-actions">
                        <button class="copy-code-btn" onclick="navigator.clipboard.writeText('${voucher.voucherCode}'); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy Code', 2000)">Copy Code</button>
                        <button class="mark-used-btn" onclick="this.closest('.voucher-card').classList.add('used'); this.disabled=true">Mark as Used</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    html += '</div>';
    container.innerHTML = html;
}

handleRewardRedemption(rewardId) {
    const userProfile = this.game.storage.getUserProfile();
    const result = this.game.rewards.redeemReward(rewardId, userProfile.totalPoints);
    
    if (result.success) {
        // Deduct points from user profile
        const gameData = this.game.storage.getGameData();
        gameData.userProfile.totalPoints -= result.redemption.pointsSpent;
        this.game.storage.saveGameData(gameData);
        
        // Show success modal
        this.showVoucherModal(result.redemption);
        
        // Update UI
        this.game.updateAllUI();
        
        // Refresh rewards modal
        this.updateRewardsContent('vouchers');
        
        this.showNotification(`Reward redeemed! Voucher code: ${result.redemption.voucherCode}`, 'success', 5000);
    } else {
        this.showNotification(`Failed to redeem reward: ${result.error}`, 'error');
    }
}

showVoucherModal(redemption) {
    const modal = document.createElement('div');
    modal.className = 'modal voucher-success-modal';
    modal.innerHTML = `
        <div class="modal-content voucher-success-content">
            <h2>🎉 Reward Redeemed!</h2>
            <div class="voucher-display">
                <div class="voucher-code-display">${redemption.voucherCode}</div>
                <h3>${redemption.rewardName}</h3>
                <div class="voucher-partner">${redemption.partner}</div>
                <div class="voucher-instructions">
                    ${redemption.instructions}
                </div>
                <div class="voucher-expiry">
                    Valid until: ${new Date(redemption.expiresAt).toLocaleDateString()}
                </div>
            </div>
            <div class="voucher-actions">
                <button class="copy-voucher-btn" onclick="navigator.clipboard.writeText('${redemption.voucherCode}'); this.textContent='Copied!';">Copy Voucher Code</button>
                <button class="modal-btn" onclick="this.closest('.modal').remove()">Got It!</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

showDataExport() {
    if (!document.getElementById('dataExportModal')) {
        this.createDataExportModal();
    }
    
    document.getElementById('dataExportModal').style.display = 'flex';
}

previewExportData() {
    const filters = this.getExportFilters();
    const anonymizationSettings = this.getAnonymizationSettings();
    
    // Get preview data (first 10 records)
    const rawData = this.game.dataExport.getRawDiscoveryData();
    const filteredData = this.game.dataExport.applyFilters(rawData, filters);
    const anonymizedData = this.game.dataExport.anonymizeData(filteredData.slice(0, 10), anonymizationSettings);
    
    const previewContainer = document.getElementById('exportPreview');
    previewContainer.innerHTML = `
        <div class="preview-section">
            <h3>📋 Data Preview</h3>
            <div class="preview-stats">
                <span><strong>Total Records:</strong> ${filteredData.length.toLocaleString()}</span>
                <span><strong>Preview Showing:</strong> ${Math.min(10, filteredData.length)} records</span>
                <span><strong>Anonymization Level:</strong> ${anonymizedData[0]?.anonymization_level || 'N/A'}</span>
            </div>
            <div class="preview-table">
                <table>
                    <thead>
                        <tr>
                            ${anonymizedData.length > 0 ? Object.keys(anonymizedData[0]).map(key => `<th>${key}</th>`).join('') : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${anonymizedData.map(record => 
                            `<tr>${Object.values(record).map(value => `<td>${value || 'N/A'}</td>`).join('')}</tr>`
                        ).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

executeDataExport() {
    const filters = this.getExportFilters();
    const anonymizationSettings = this.getAnonymizationSettings();
    const format = document.querySelector('input[name="exportFormat"]:checked').value;
    
    const result = this.game.dataExport.exportData(filters, anonymizationSettings, format);
    
    if (result.success) {
        this.showNotification(`📥 Dataset exported! ${result.recordsExported} records in ${result.filename}`, 'success', 5000);
        
        // Close modal after short delay
        setTimeout(() => {
            document.getElementById('dataExportModal').style.display = 'none';
        }, 2000);
    } else {
        this.showNotification(`Export failed: ${result.error}`, 'error');
    }
}

getExportFilters() {
    const selectedSpecies = Array.from(document.querySelectorAll('#speciesSelector input:checked')).map(cb => cb.value);
    const selectedWeather = Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(cb => cb.value);
    
    return {
        species: selectedSpecies,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        weather: selectedWeather,
        minConfidence: parseInt(document.getElementById('minConfidence').value)
    };
}

getAnonymizationSettings() {
    return {
        location: {
            method: document.getElementById('locationAnonymization').value,
            parameter: 3 // Default precision
        },
        temporal: {
            method: document.getElementById('timeAnonymization').value
        }
    };
}
// Replace the renderCollection method in enhanced-ui.js
renderCollection() {
    const discoveries = this.game.storage.getSpeciesCollection();
    const grid = document.getElementById('collectionGrid');
    
    if (!grid) {
        console.error('Collection grid not found');
        return;
    }
    
    if (discoveries.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--dark-gray);">
                <h3>No Species Discovered Yet</h3>
                <p>Start capturing insects and plants to build your collection.</p>
            </div>
        `;
        return;
    }

    console.log('📚 Rendering collection with discoveries:', discoveries);

    grid.innerHTML = discoveries.map(discovery => {
        // Debug: Check if photo exists
        console.log(`🖼️ Discovery "${discovery.species}" has photo:`, !!discovery.photo);
        
        // Use the actual photo if it exists, otherwise use placeholder
        const imageUrl = discovery.photo || 'https://via.placeholder.com/300x200?text=No+Photo';
        const rarityClass = discovery.rarity || 'common';
        
        return `
            <div class="species-card ${rarityClass}">
                <div class="rarity-badge ${rarityClass}">${rarityClass.toUpperCase()}</div>
                <img 
                    class="card-image" 
                    src="${imageUrl}" 
                    alt="${discovery.species}"
                    onerror="this.src='https://via.placeholder.com/300x200?text=Photo+Error'"
                />
                <div class="card-info">
                    <h4>${discovery.species}</h4>
                    <div class="card-stats">
                        <span>Confidence: ${discovery.confidence}%</span>
                        <span>Points: ${discovery.points}</span>
                    </div>
                    <div class="card-stats">
                        <span>Discovered: ${discovery.date || new Date(discovery.timestamp).toLocaleDateString()}</span>
                        <span>Rarity: ${rarityClass}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    console.log('✅ Collection rendered successfully');
}


}
