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
}
