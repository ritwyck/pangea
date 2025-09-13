class ProgressionSystem {
    constructor() {
        this.levels = this.initializeLevels();
        this.achievements = this.initializeAchievements();
        this.skillTree = this.initializeSkillTree();
        this.raritySystem = this.initializeRaritySystem();
    }

    initializeLevels() {
        const levels = [];
        for (let i = 1; i <= 50; i++) {
            levels.push({
                level: i,
                xpRequired: Math.floor(100 * Math.pow(1.2, i - 1)),
                title: this.getLevelTitle(i),
                rewards: this.getLevelRewards(i)
            });
        }
        return levels;
    }

    getLevelTitle(level) {
        if (level < 5) return "Curious Observer";
        if (level < 10) return "Nature Enthusiast"; 
        if (level < 15) return "Wildlife Tracker";
        if (level < 20) return "Field Researcher";
        if (level < 25) return "Species Expert";
        if (level < 30) return "Ecosystem Master";
        if (level < 35) return "Conservation Hero";
        if (level < 40) return "Legendary Naturalist";
        if (level < 50) return "Apex Explorer";
        return "Nature's Guardian";
    }

    getLevelRewards(level) {
        const rewards = [];
        if (level % 5 === 0) rewards.push({ type: 'skill_point', amount: 1 });
        if (level % 10 === 0) rewards.push({ type: 'rare_boost', duration: '24h' });
        if (level === 25) rewards.push({ type: 'legendary_scanner', permanent: true });
        return rewards;
    }

    initializeAchievements() {
        return [
            // Discovery Achievements
            { id: 'first_discovery', name: 'First Steps', description: 'Make your first discovery', icon: '🔍', points: 50, unlocked: false },
            { id: 'species_collector_5', name: 'Getting Started', description: 'Discover 5 different species', icon: '📚', points: 100, unlocked: false },
            { id: 'species_collector_10', name: 'Nature Student', description: 'Discover 10 different species', icon: '🎓', points: 200, unlocked: false },
            { id: 'species_collector_25', name: 'Field Expert', description: 'Discover 25 different species', icon: '🏆', points: 500, unlocked: false },
            
            // Specialization Achievements
            { id: 'butterfly_hunter', name: 'Butterfly Hunter', description: 'Capture 10 butterflies', icon: '🦋', points: 150, unlocked: false },
            { id: 'bee_keeper', name: 'Bee Whisperer', description: 'Capture 15 bees', icon: '🐝', points: 200, unlocked: false },
            { id: 'flower_power', name: 'Flower Power', description: 'Discover 20 different flowers', icon: '🌸', points: 250, unlocked: false },
            
            // Rarity Achievements
            { id: 'rare_finder', name: 'Rare Finder', description: 'Discover your first rare species', icon: '💎', points: 300, unlocked: false },
            { id: 'epic_hunter', name: 'Epic Hunter', description: 'Discover an epic species', icon: '⭐', points: 500, unlocked: false },
            { id: 'legendary_master', name: 'Legendary Master', description: 'Discover a legendary species', icon: '👑', points: 1000, unlocked: false },
            
            // Streaks & Consistency
            { id: 'daily_explorer', name: 'Daily Explorer', description: 'Complete daily challenge', icon: '📅', points: 100, unlocked: false },
            { id: 'week_warrior', name: 'Week Warrior', description: '7-day discovery streak', icon: '🔥', points: 300, unlocked: false },
            { id: 'monthly_master', name: 'Monthly Master', description: '30-day discovery streak', icon: '🗓️', points: 1000, unlocked: false },
            
            // Location & Weather
            { id: 'globe_trotter', name: 'Globe Trotter', description: 'Discover species in 5 different locations', icon: '🌍', points: 400, unlocked: false },
            { id: 'weather_watcher', name: 'Weather Watcher', description: 'Make discoveries in 3 different weather conditions', icon: '⛅', points: 200, unlocked: false },
            { id: 'night_owl', name: 'Night Owl', description: 'Make 10 discoveries after sunset', icon: '🦉', points: 250, unlocked: false },
            
            // Points & Performance
            { id: 'point_collector_1k', name: 'Point Collector', description: 'Earn 1,000 total points', icon: '💰', points: 100, unlocked: false },
            { id: 'point_collector_10k', name: 'Point Master', description: 'Earn 10,000 total points', icon: '💎', points: 500, unlocked: false },
            { id: 'perfect_shot', name: 'Perfect Shot', description: 'Capture with 95%+ confidence', icon: '🎯', points: 200, unlocked: false },
            
            // Special Events
            { id: 'seasonal_specialist', name: 'Seasonal Specialist', description: 'Complete a seasonal event', icon: '🍂', points: 300, unlocked: false },
            { id: 'speed_demon', name: 'Speed Demon', description: 'Make 5 discoveries in 1 minute', icon: '⚡', points: 400, unlocked: false }
        ];
    }

    initializeSkillTree() {
        return {
            detection: {
                name: 'Detection Mastery',
                skills: [
                    { id: 'confidence_boost', name: 'Confidence Boost', description: '+5% detection confidence', maxLevel: 5, cost: 1 },
                    { id: 'rare_sense', name: 'Rare Sense', description: '+10% chance to find rare species', maxLevel: 3, cost: 2 },
                    { id: 'quick_scan', name: 'Quick Scanner', description: 'Faster detection cycles', maxLevel: 3, cost: 1 }
                ]
            },
            collection: {
                name: 'Collection Expert',
                skills: [
                    { id: 'point_multiplier', name: 'Point Multiplier', description: '+10% points per discovery', maxLevel: 5, cost: 1 },
                    { id: 'duplicate_bonus', name: 'Duplicate Bonus', description: '+50% points for re-discoveries', maxLevel: 3, cost: 2 },
                    { id: 'streak_keeper', name: 'Streak Keeper', description: 'Maintain streaks longer', maxLevel: 2, cost: 3 }
                ]
            },
            exploration: {
                name: 'Master Explorer',
                skills: [
                    { id: 'weather_bonus', name: 'Weather Bonus', description: 'Weather conditions boost certain species', maxLevel: 3, cost: 2 },
                    { id: 'location_tracker', name: 'Location Tracker', description: 'Remember discovery hotspots', maxLevel: 1, cost: 3 },
                    { id: 'night_vision', name: 'Night Vision', description: 'Better detection in low light', maxLevel: 2, cost: 2 }
                ]
            }
        };
    }

    initializeRaritySystem() {
        return {
            common: { name: 'Common', color: '#95a5a6', multiplier: 1.0, dropRate: 0.7 },
            uncommon: { name: 'Uncommon', color: '#3498db', multiplier: 1.5, dropRate: 0.2 },
            rare: { name: 'Rare', color: '#9b59b6', multiplier: 2.0, dropRate: 0.08 },
            epic: { name: 'Epic', color: '#e67e22', multiplier: 3.0, dropRate: 0.015 },
            legendary: { name: 'Legendary', color: '#f1c40f', multiplier: 5.0, dropRate: 0.005 }
        };
    }

    calculateXP(basePoints, rarity, bonuses = {}) {
        let xp = basePoints;
        
        // Apply rarity multiplier
        if (rarity && this.raritySystem[rarity]) {
            xp *= this.raritySystem[rarity].multiplier;
        }
        
        // Apply skill bonuses
        if (bonuses.pointMultiplier) xp *= (1 + bonuses.pointMultiplier);
        if (bonuses.weatherBonus) xp *= 1.2;
        if (bonuses.streakBonus) xp *= bonuses.streakBonus;
        
        return Math.floor(xp);
    }

    checkAchievements(gameData) {
        const newAchievements = [];
        
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && this.checkAchievementCondition(achievement, gameData)) {
                achievement.unlocked = true;
                achievement.unlockedDate = new Date().toISOString();
                newAchievements.push(achievement);
            }
        });
        
        return newAchievements;
    }

    checkAchievementCondition(achievement, gameData) {
        const { userProfile, discoveredSpecies, gameStats } = gameData;
        
        switch (achievement.id) {
            case 'first_discovery':
                return discoveredSpecies.length > 0;
            case 'species_collector_5':
                return gameStats.uniqueSpecies >= 5;
            case 'species_collector_10':
                return gameStats.uniqueSpecies >= 10;
            case 'species_collector_25':
                return gameStats.uniqueSpecies >= 25;
            case 'point_collector_1k':
                return userProfile.totalPoints >= 1000;
            case 'point_collector_10k':
                return userProfile.totalPoints >= 10000;
            case 'butterfly_hunter':
                return discoveredSpecies.filter(s => s.species === 'Butterfly').length >= 10;
            case 'perfect_shot':
                return discoveredSpecies.some(s => s.confidence >= 95);
            // Add more conditions as needed
            default:
                return false;
        }
    }
}
