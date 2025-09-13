class ChallengeSystem {
    constructor() {
        this.dailyChallenges = this.initializeDailyChallenges();
        this.seasonalEvents = this.initializeSeasonalEvents();
        this.streaks = this.initializeStreaks();
    }

    initializeDailyChallenges() {
        return [
            // Discovery Challenges
            { id: 'daily_discover_3', name: 'Nature Scout', description: 'Discover 3 different species', reward: { xp: 100, points: 50 }, type: 'discovery' },
            { id: 'daily_points_500', name: 'Point Hunter', description: 'Earn 500 points', reward: { xp: 150, points: 75 }, type: 'points' },
            { id: 'daily_confidence_80', name: 'Sharp Eye', description: 'Get 5 captures with 80%+ confidence', reward: { xp: 120, rare_boost: '2h' }, type: 'skill' },
            
            // Category Challenges  
            { id: 'daily_insects_only', name: 'Bug Hunter', description: 'Capture 5 insects only', reward: { xp: 100, achievement_progress: 'butterfly_hunter' }, type: 'category' },
            { id: 'daily_plants_only', name: 'Botanist', description: 'Discover 4 plants only', reward: { xp: 100, achievement_progress: 'flower_power' }, type: 'category' },
            
            // Time Challenges
            { id: 'daily_morning_bird', name: 'Early Bird', description: 'Make 3 discoveries before 10 AM', reward: { xp: 150, skill_point: 1 }, type: 'time' },
            { id: 'daily_night_owl', name: 'Night Explorer', description: 'Make 2 discoveries after 8 PM', reward: { xp: 200, achievement_progress: 'night_owl' }, type: 'time' },
            
            // Perfect Game Challenges
            { id: 'daily_perfect_streak', name: 'Perfect Streak', description: 'Get 3 discoveries in a row with 90%+ confidence', reward: { xp: 300, legendary_boost: '1h' }, type: 'perfect' },
            { id: 'daily_speed_run', name: 'Speed Explorer', description: 'Make 5 discoveries in 3 minutes', reward: { xp: 250, achievement_progress: 'speed_demon' }, type: 'speed' },
            
            // Weather Challenges (dynamic based on weather)
            { id: 'daily_weather_master', name: 'Weather Master', description: 'Adapt to current weather conditions', reward: { xp: 200, weather_bonus: '24h' }, type: 'weather' }
        ];
    }

    initializeSeasonalEvents() {
        return [
            {
                id: 'spring_awakening',
                name: 'Spring Awakening',
                description: 'Celebrate the return of nature with blooming discoveries!',
                startDate: '2025-03-20',
                endDate: '2025-04-20',
                bonusSpecies: ['Rose', 'Sunflower', 'Butterfly'],
                rewards: { xp_multiplier: 2.0, rare_chance_boost: 0.1 },
                challenges: [
                    { name: 'Flower Festival', description: 'Discover 15 flowers during the event', reward: { badge: 'spring_master', points: 1000 } }
                ]
            },
            {
                id: 'summer_safari',
                name: 'Summer Safari',
                description: 'Peak activity season - insects everywhere!',
                startDate: '2025-06-21',
                endDate: '2025-07-21',
                bonusSpecies: ['Bee', 'Beetle', 'Spider'],
                rewards: { insect_bonus: 1.5, legendary_chance: 0.02 },
                challenges: [
                    { name: 'Insect Master', description: 'Capture 50 insects during summer', reward: { title: 'Summer Safari Champion', points: 2000 } }
                ]
            },
            {
                id: 'autumn_harvest',
                name: 'Autumn Harvest',
                description: 'Last chance before winter - rare species emerge!',
                startDate: '2025-09-22',
                endDate: '2025-10-22',
                bonusSpecies: ['Oak Leaf', 'Pine Cone'],
                rewards: { rare_multiplier: 3.0, epic_chance: 0.05 },
                challenges: [
                    { name: 'Harvest Moon', description: 'Find 5 legendary species', reward: { permanent_boost: 'legendary_scanner', points: 5000 } }
                ]
            }
        ];
    }

    initializeStreaks() {
        return {
            daily: { current: 0, best: 0, lastDate: null },
            perfect: { current: 0, best: 0, threshold: 90 },
            species: { current: 0, best: 0, lastSpecies: null }
        };
    }

    generateDailyChallenge() {
        const today = new Date().toDateString();
        const seed = this.hashCode(today);
        const random = this.seededRandom(seed);
        
        // Select 3 random challenges for today
        const availableChallenges = [...this.dailyChallenges];
        const todayChallenges = [];
        
        for (let i = 0; i < 3; i++) {
            const index = Math.floor(random() * availableChallenges.length);
            const challenge = { ...availableChallenges[index] };
            challenge.progress = 0;
            challenge.completed = false;
            challenge.date = today;
            
            todayChallenges.push(challenge);
            availableChallenges.splice(index, 1);
        }
        
        return todayChallenges;
    }

    updateChallengeProgress(challenges, discovery) {
        const updatedChallenges = [...challenges];
        let completedChallenges = [];
        
        updatedChallenges.forEach(challenge => {
            if (challenge.completed) return;
            
            let progressMade = false;
            
            switch (challenge.type) {
                case 'discovery':
                    if (challenge.id === 'daily_discover_3') {
                        // Track unique species discovered today
                        challenge.discoveredToday = challenge.discoveredToday || new Set();
                        challenge.discoveredToday.add(discovery.species);
                        challenge.progress = challenge.discoveredToday.size;
                        progressMade = challenge.progress >= 3;
                    }
                    break;
                    
                case 'points':
                    if (challenge.id === 'daily_points_500') {
                        challenge.progress = (challenge.progress || 0) + discovery.points;
                        progressMade = challenge.progress >= 500;
                    }
                    break;
                    
                case 'skill':
                    if (challenge.id === 'daily_confidence_80' && discovery.confidence >= 80) {
                        challenge.progress = (challenge.progress || 0) + 1;
                        progressMade = challenge.progress >= 5;
                    }
                    break;
                    
                case 'category':
                    if (challenge.id === 'daily_insects_only') {
                        const insectTypes = ['Butterfly', 'Bee', 'Beetle', 'Spider'];
                        if (insectTypes.includes(discovery.species)) {
                            challenge.progress = (challenge.progress || 0) + 1;
                            progressMade = challenge.progress >= 5;
                        }
                    }
                    break;
                    
                case 'time':
                    const hour = new Date().getHours();
                    if (challenge.id === 'daily_morning_bird' && hour < 10) {
                        challenge.progress = (challenge.progress || 0) + 1;
                        progressMade = challenge.progress >= 3;
                    } else if (challenge.id === 'daily_night_owl' && hour >= 20) {
                        challenge.progress = (challenge.progress || 0) + 1;
                        progressMade = challenge.progress >= 2;
                    }
                    break;
            }
            
            if (progressMade && !challenge.completed) {
                challenge.completed = true;
                challenge.completedAt = new Date().toISOString();
                completedChallenges.push(challenge);
            }
        });
        
        return { updatedChallenges, completedChallenges };
    }

    getCurrentSeasonalEvent() {
        const now = new Date();
        return this.seasonalEvents.find(event => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            return now >= start && now <= end;
        });
    }

    // Utility functions
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    seededRandom(seed) {
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }
}
