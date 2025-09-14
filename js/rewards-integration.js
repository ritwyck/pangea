
class RewardsIntegration {
    constructor() {
        this.partnerRewards = this.initializePartnerRewards();
        this.voucherCodes = this.initializeVoucherCodes();
        this.redemptionHistory = this.loadRedemptionHistory();
    }

    initializePartnerRewards() {
        return {
            transport: [
                {
                    id: 'city_bus_day',
                    name: 'City Bus Day Pass',
                    partner: 'City Transport',
                    cost: 800,
                    description: 'Full day unlimited bus travel in the city',
                    icon: '🚌',
                    category: 'transport',
                    value: '€4.50',
                    availability: 'Available daily',
                    terms: 'Valid for 24 hours from activation'
                },
                {
                    id: 'bike_share_weekly',
                    name: 'Bike Share Weekly Pass',
                    partner: 'EcoBike Network',
                    cost: 1200,
                    description: 'One week unlimited bike rentals',
                    icon: '🚲',
                    category: 'transport',
                    value: '€12.00',
                    availability: 'Subject to bike availability',
                    terms: 'Valid at all EcoBike stations'
                }
            ],
            food: [
                {
                    id: 'coffee_medium',
                    name: 'Medium Coffee',
                    partner: 'Green Bean Café',
                    cost: 300,
                    description: 'Any medium coffee or tea at participating locations',
                    icon: '☕',
                    category: 'food',
                    value: '€3.50',
                    availability: '20+ locations citywide',
                    terms: 'One per day, valid for 30 days'
                },
                {
                    id: 'lunch_discount',
                    name: '25% Lunch Discount',
                    partner: 'EcoEats Restaurant Group',
                    cost: 600,
                    description: '25% off lunch menu at participating restaurants',
                    icon: '🥗',
                    category: 'food',
                    value: 'Up to €8.00',
                    availability: '15+ eco-friendly restaurants',
                    terms: 'Valid weekdays 11AM-3PM for 60 days'
                }
            ],
            shopping: [
                {
                    id: 'bookstore_discount',
                    name: '15% Bookstore Discount',
                    partner: 'Nature Books & More',
                    cost: 400,
                    description: '15% off nature and science books',
                    icon: '📚',
                    category: 'shopping',
                    value: 'Up to €15.00',
                    availability: 'Online and 3 physical stores',
                    terms: 'Valid for 90 days, excludes sale items'
                },
                {
                    id: 'garden_center',
                    name: 'Garden Center Voucher',
                    partner: 'Urban Garden Supply',
                    cost: 1000,
                    description: '€10 voucher for plants and gardening supplies',
                    icon: '🌱',
                    category: 'shopping',
                    value: '€10.00',
                    availability: '5 locations + online',
                    terms: 'Valid for 6 months, minimum purchase €20'
                }
            ],
            experiences: [
                {
                    id: 'museum_entry',
                    name: 'Natural History Museum Entry',
                    partner: 'City Natural History Museum',
                    cost: 1500,
                    description: 'Free admission to permanent exhibitions',
                    icon: '🏛️',
                    category: 'experiences',
                    value: '€12.00',
                    availability: 'Open Tue-Sun',
                    terms: 'Valid for 1 year, excludes special exhibitions'
                },
                {
                    id: 'nature_tour',
                    name: 'Guided Nature Walk',
                    partner: 'Urban Wildlife Tours',
                    cost: 2000,
                    description: '2-hour guided nature photography walk',
                    icon: '🥾',
                    category: 'experiences',
                    value: '€25.00',
                    availability: 'Weekends, booking required',
                    terms: 'Valid for 6 months, subject to weather'
                }
            ]
        };
    }

    initializeVoucherCodes() {
        return new Map(); // Will store generated voucher codes
    }

    loadRedemptionHistory() {
        const saved = localStorage.getItem('rewardsRedemptionHistory');
        return saved ? JSON.parse(saved) : [];
    }

    getAllRewards() {
        const allRewards = [];
        Object.values(this.partnerRewards).forEach(category => {
            allRewards.push(...category);
        });
        return allRewards.sort((a, b) => a.cost - b.cost);
    }

    canRedeem(rewardId, userPoints) {
        const reward = this.getAllRewards().find(r => r.id === rewardId);
        return reward && userPoints >= reward.cost;
    }

    generateVoucherCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'ND'; // Nature Detective prefix
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    redeemReward(rewardId, userPoints) {
        const reward = this.getAllRewards().find(r => r.id === rewardId);
        if (!reward || userPoints < reward.cost) {
            return { success: false, error: 'Insufficient points or invalid reward' };
        }

        // Generate unique voucher code
        const voucherCode = this.generateVoucherCode();
        const redemption = {
            id: `redemption_${Date.now()}`,
            rewardId: reward.id,
            rewardName: reward.name,
            partner: reward.partner,
            voucherCode: voucherCode,
            pointsSpent: reward.cost,
            redeemedAt: new Date().toISOString(),
            status: 'active',
            expiresAt: this.calculateExpirationDate(reward),
            instructions: this.getRedemptionInstructions(reward, voucherCode)
        };

        // Store voucher code
        this.voucherCodes.set(voucherCode, {
            rewardId: reward.id,
            redeemedAt: redemption.redeemedAt,
            status: 'active'
        });

        // Add to redemption history
        this.redemptionHistory.push(redemption);
        this.saveRedemptionHistory();

        return { success: true, redemption: redemption };
    }

    calculateExpirationDate(reward) {
        const now = new Date();
        let expirationDays = 30; // Default 30 days

        if (reward.terms.includes('24 hours')) expirationDays = 1;
        else if (reward.terms.includes('30 days')) expirationDays = 30;
        else if (reward.terms.includes('60 days')) expirationDays = 60;
        else if (reward.terms.includes('90 days')) expirationDays = 90;
        else if (reward.terms.includes('6 months')) expirationDays = 180;
        else if (reward.terms.includes('1 year')) expirationDays = 365;

        const expiration = new Date(now.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
        return expiration.toISOString();
    }

    getRedemptionInstructions(reward, voucherCode) {
        const baseInstructions = {
            transport: `Show this voucher code at any ${reward.partner} station or validate in the mobile app.`,
            food: `Present this voucher code to staff at any participating ${reward.partner} location.`,
            shopping: `Use voucher code "${voucherCode}" at checkout online or show to cashier in-store.`,
            experiences: `Book online at ${reward.partner} website using code "${voucherCode}" or call to reserve.`
        };

        return baseInstructions[reward.category] || `Use voucher code "${voucherCode}" at participating ${reward.partner} locations.`;
    }

    getActiveVouchers() {
        const now = new Date();
        return this.redemptionHistory.filter(r => 
            r.status === 'active' && new Date(r.expiresAt) > now
        );
    }

    markVoucherAsUsed(voucherId) {
        const redemption = this.redemptionHistory.find(r => r.id === voucherId);
        if (redemption) {
            redemption.status = 'used';
            redemption.usedAt = new Date().toISOString();
            this.saveRedemptionHistory();
        }
    }

    saveRedemptionHistory() {
        localStorage.setItem('rewardsRedemptionHistory', JSON.stringify(this.redemptionHistory));
    }

    getRedemptionStats() {
        const totalRedeemed = this.redemptionHistory.length;
        const totalValue = this.redemptionHistory.reduce((sum, r) => {
            const reward = this.getAllRewards().find(reward => reward.id === r.rewardId);
            return sum + (reward ? parseFloat(reward.value.replace(/[€$£]/g, '')) : 0);
        }, 0);

        const categoryStats = {};
        this.redemptionHistory.forEach(r => {
            const reward = this.getAllRewards().find(reward => reward.id === r.rewardId);
            if (reward) {
                categoryStats[reward.category] = (categoryStats[reward.category] || 0) + 1;
            }
        });

        return {
            totalRedeemed,
            totalValue: totalValue.toFixed(2),
            categoryStats,
            activeVouchers: this.getActiveVouchers().length
        };
    }
}
