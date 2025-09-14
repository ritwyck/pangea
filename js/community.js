class CommunitySystem {
    constructor() {
        this.neighborhoods = this.initializeNeighborhoods();
        this.userNeighborhood = null;
        this.communityPool = this.initializeCommunityPool();
        this.leaderboards = this.initializeLeaderboards();
        this.redemptions = this.initializeRedemptions();
    }

    initializeNeighborhoods() {
        // Sample neighborhoods - in real app, this would come from a server
        return [
            { id: 'downtown', name: 'Downtown District', memberCount: 127, totalPoints: 45230 },
            { id: 'riverside', name: 'Riverside Community', memberCount: 89, totalPoints: 32100 },
            { id: 'hilltop', name: 'Hilltop Gardens', memberCount: 156, totalPoints: 58900 },
            { id: 'oldtown', name: 'Old Town', memberCount: 203, totalPoints: 73450 },
            { id: 'greenpark', name: 'Green Park Area', memberCount: 95, totalPoints: 28700 }
        ];
    }

    initializeCommunityPool() {
        return {
            communityGoals: [
                {
                    id: 'biodiversity_survey',
                    name: 'Biodiversity Survey 2025',
                    description: 'Document 500 unique species across all neighborhoods',
                    targetPoints: 50000,
                    currentPoints: 0,
                    rewards: [
                        { type: 'individual', reward: 'Biodiversity Badge + 1000 bonus points', cost: 100 },
                        { type: 'community', reward: 'City Park Enhancement Fund', cost: 25000 }
                    ],
                    deadline: '2025-12-31'
                },
                {
                    id: 'seasonal_explorer',
                    name: 'Seasonal Explorer Challenge',
                    description: 'Capture seasonal changes across the city',
                    targetPoints: 25000,
                    currentPoints: 0,
                    rewards: [
                        { type: 'individual', reward: 'Season Master Title + Special Frame', cost: 50 },
                        { type: 'community', reward: 'Community Garden Sponsorship', cost: 15000 }
                    ],
                    deadline: '2025-11-30'
                }
            ],
            individualRedemptions: [
                { id: 'coffee_voucher', name: 'Local Café Voucher', cost: 500, description: '€5 voucher for participating local cafés' },
                { id: 'plant_seeds', name: 'Native Plant Seeds', cost: 200, description: 'Packet of native wildflower seeds' },
                { id: 'nature_guide', name: 'Digital Nature Guide', cost: 800, description: 'Premium species identification guide' },
                { id: 'eco_tote', name: 'Eco-Friendly Tote Bag', cost: 300, description: 'Reusable bag with community logo' },
                { id: 'park_pass', name: 'Monthly Park Pass', cost: 1000, description: 'Free access to all city parks for one month' }
            ],
            communityRedemptions: [
                { id: 'bee_hotel', name: 'Neighborhood Bee Hotel', cost: 5000, description: 'Install bee hotels in local parks' },
                { id: 'butterfly_garden', name: 'Community Butterfly Garden', cost: 8000, description: 'Create dedicated butterfly habitat' },
                { id: 'nature_trail', name: 'Guided Nature Trail', cost: 12000, description: 'Monthly guided walks for residents' },
                { id: 'wildlife_camera', name: 'Wildlife Monitoring Camera', cost: 15000, description: 'Trail cameras for wildlife research' },
                { id: 'pollinator_meadow', name: 'Pollinator Meadow', cost: 25000, description: 'Convert unused land to pollinator habitat' }
            ]
        };
    }

    initializeLeaderboards() {
        return {
            global: [],
            neighborhood: [],
            weekly: [],
            species: {},
            achievements: []
        };
    }

    initializeRedemptions() {
        const saved = localStorage.getItem('userRedemptions');
        return saved ? JSON.parse(saved) : {
            individual: [],
            community: [],
            availablePoints: 0
        };
    }

    registerWithNeighborhood(neighborhoodId, username) {
        const neighborhood = this.neighborhoods.find(n => n.id === neighborhoodId);
        if (!neighborhood) return false;

        this.userNeighborhood = {
            id: neighborhoodId,
            name: neighborhood.name,
            username: username,
            joinDate: new Date().toISOString(),
            contributedPoints: 0,
            rank: neighborhood.memberCount + 1
        };

        // Update neighborhood member count
        neighborhood.memberCount += 1;

        // Save to localStorage
        localStorage.setItem('userNeighborhood', JSON.stringify(this.userNeighborhood));
        localStorage.setItem('neighborhoods', JSON.stringify(this.neighborhoods));

        return true;
    }

    contributePoints(points) {
        if (!this.userNeighborhood) return false;

        // Add to user's contribution
        this.userNeighborhood.contributedPoints += points;

        // Add to neighborhood total
        const neighborhood = this.neighborhoods.find(n => n.id === this.userNeighborhood.id);
        if (neighborhood) {
            neighborhood.totalPoints += points;
        }

        // Update community goals
        this.communityPool.communityGoals.forEach(goal => {
            goal.currentPoints += points;
        });

        // Save updates
        localStorage.setItem('userNeighborhood', JSON.stringify(this.userNeighborhood));
        localStorage.setItem('neighborhoods', JSON.stringify(this.neighborhoods));
        localStorage.setItem('communityPool', JSON.stringify(this.communityPool));

        return true;
    }

    canRedeemIndividual(itemId) {
        const item = this.communityPool.individualRedemptions.find(r => r.id === itemId);
        if (!item) return false;

        const userProfile = JSON.parse(localStorage.getItem('insectDetectionGame'))?.userProfile;
        return userProfile && userProfile.totalPoints >= item.cost;
    }

    redeemIndividual(itemId) {
        if (!this.canRedeemIndividual(itemId)) return false;

        const item = this.communityPool.individualRedemptions.find(r => r.id === itemId);
        const gameData = JSON.parse(localStorage.getItem('insectDetectionGame'));
        
        // Deduct points
        gameData.userProfile.totalPoints -= item.cost;
        
        // Add to redemption history
        this.redemptions.individual.push({
            ...item,
            redeemedAt: new Date().toISOString(),
            redeemed: true
        });

        // Save updates
        localStorage.setItem('insectDetectionGame', JSON.stringify(gameData));
        localStorage.setItem('userRedemptions', JSON.stringify(this.redemptions));

        return true;
    }

    canRedeemCommunity(itemId) {
        const item = this.communityPool.communityRedemptions.find(r => r.id === itemId);
        if (!item || !this.userNeighborhood) return false;

        const neighborhood = this.neighborhoods.find(n => n.id === this.userNeighborhood.id);
        return neighborhood && neighborhood.totalPoints >= item.cost;
    }

    redeemCommunity(itemId) {
        if (!this.canRedeemCommunity(itemId)) return false;

        const item = this.communityPool.communityRedemptions.find(r => r.id === itemId);
        const neighborhood = this.neighborhoods.find(n => n.id === this.userNeighborhood.id);

        // Deduct from neighborhood points
        neighborhood.totalPoints -= item.cost;

        // Add to community redemption history
        this.redemptions.community.push({
            ...item,
            redeemedAt: new Date().toISOString(),
            redeemedBy: this.userNeighborhood.username,
            neighborhood: neighborhood.name
        });

        // Save updates
        localStorage.setItem('neighborhoods', JSON.stringify(this.neighborhoods));
        localStorage.setItem('userRedemptions', JSON.stringify(this.redemptions));

        return true;
    }

    getNeighborhoodLeaderboard() {
        return [...this.neighborhoods]
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((n, index) => ({
                ...n,
                rank: index + 1,
                avgPointsPerMember: Math.round(n.totalPoints / n.memberCount)
            }));
    }

    getUserRankInNeighborhood() {
        if (!this.userNeighborhood) return null;
        
        // Simulate neighborhood member rankings
        // In real app, this would come from server
        const mockMembers = this.generateMockNeighborhoodMembers();
        mockMembers.push({
            username: this.userNeighborhood.username,
            points: this.userNeighborhood.contributedPoints,
            isCurrentUser: true
        });

        const sorted = mockMembers.sort((a, b) => b.points - a.points);
        const userRank = sorted.findIndex(m => m.isCurrentUser) + 1;

        return {
            rank: userRank,
            totalMembers: sorted.length,
            topMembers: sorted.slice(0, 10)
        };
    }

    generateMockNeighborhoodMembers() {
        const names = ['Alex', 'Sam', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Blake'];
        return names.map(name => ({
            username: name,
            points: Math.floor(Math.random() * 2000) + 100,
            isCurrentUser: false
        }));
    }

    getCommunityStats() {
        const totalCommunityPoints = this.neighborhoods.reduce((sum, n) => sum + n.totalPoints, 0);
        const totalMembers = this.neighborhoods.reduce((sum, n) => sum + n.memberCount, 0);
        const activeGoals = this.communityPool.communityGoals.filter(g => new Date(g.deadline) > new Date());

        return {
            totalCommunityPoints,
            totalMembers,
            activeGoals: activeGoals.length,
            neighborhoods: this.neighborhoods.length,
            userContribution: this.userNeighborhood?.contributedPoints || 0,
            userNeighborhoodRank: this.userNeighborhood ? 
                this.neighborhoods.findIndex(n => n.id === this.userNeighborhood.id) + 1 : null
        };
    }
}
