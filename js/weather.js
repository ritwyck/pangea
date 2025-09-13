class WeatherSystem {
    constructor() {
        this.weatherData = null;
        this.locationData = null;
        this.weatherEffects = this.initializeWeatherEffects();
        this.apiKey = null; // We'll use Open-Meteo (free, no key required)
    }

    initializeWeatherEffects() {
        return {
            sunny: {
                name: 'Sunny',
                icon: '☀️',
                bonusSpecies: ['Butterfly', 'Bee'],
                rarityBoost: { uncommon: 0.05 },
                pointMultiplier: 1.1,
                description: 'Perfect weather for insect activity!'
            },
            cloudy: {
                name: 'Cloudy',
                icon: '☁️',
                bonusSpecies: ['Spider', 'Beetle'],
                rarityBoost: { rare: 0.03 },
                pointMultiplier: 1.0,
                description: 'Moderate conditions, good for exploration.'
            },
            rainy: {
                name: 'Rainy',
                icon: '🌧️',
                bonusSpecies: ['Oak Leaf', 'Pine Cone'],
                rarityBoost: { epic: 0.02 },
                pointMultiplier: 1.2,
                description: 'Rain brings out hidden species!'
            },
            overcast: {
                name: 'Overcast',
                icon: '⛅',
                bonusSpecies: ['Rose', 'Sunflower'],
                rarityBoost: { legendary: 0.01 },
                pointMultiplier: 1.15,
                description: 'Mysterious weather attracts rare finds.'
            },
            night: {
                name: 'Night',
                icon: '🌙',
                bonusSpecies: ['Spider', 'Beetle'],
                rarityBoost: { rare: 0.1, epic: 0.05 },
                pointMultiplier: 1.5,
                description: 'Nocturnal species emerge after dark!'
            }
        };
    }

    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: Date.now()
                    };
                    console.log('Location obtained:', this.locationData);
                    resolve(this.locationData);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    // Fallback to default location (approximate center of Europe)
                    this.locationData = {
                        latitude: 50.0755,
                        longitude: 14.4378,
                        accuracy: null,
                        timestamp: Date.now(),
                        fallback: true
                    };
                    resolve(this.locationData);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    }

    async fetchWeatherData() {
        try {
            if (!this.locationData) {
                await this.getCurrentLocation();
            }

            // Using Open-Meteo API (free, no API key required)
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.locationData.latitude}&longitude=${this.locationData.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,cloud_cover&timezone=auto`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            this.weatherData = {
                temperature: Math.round(data.current.temperature_2m),
                humidity: data.current.relative_humidity_2m,
                weatherCode: data.current.weather_code,
                cloudCover: data.current.cloud_cover,
                timestamp: Date.now(),
                location: `${this.locationData.latitude.toFixed(2)}, ${this.locationData.longitude.toFixed(2)}`
            };

            // Determine weather condition from code
            this.weatherData.condition = this.getWeatherCondition(data.current.weather_code, data.current.cloud_cover);
            
            console.log('Weather data fetched:', this.weatherData);
            return this.weatherData;
            
        } catch (error) {
            console.error('Failed to fetch weather data:', error);
            // Fallback weather
            this.weatherData = {
                temperature: 20,
                humidity: 50,
                condition: 'cloudy',
                cloudCover: 50,
                timestamp: Date.now(),
                fallback: true
            };
            return this.weatherData;
        }
    }

    getWeatherCondition(weatherCode, cloudCover) {
        // Determine time of day
        const hour = new Date().getHours();
        if (hour < 6 || hour > 20) {
            return 'night';
        }

        // Convert WMO weather codes to our conditions
        if (weatherCode >= 61 && weatherCode <= 67) return 'rainy'; // Rain
        if (weatherCode >= 80 && weatherCode <= 82) return 'rainy'; // Showers
        if (cloudCover < 25) return 'sunny';
        if (cloudCover < 75) return 'cloudy';
        return 'overcast';
    }

    getCurrentWeatherEffect() {
        if (!this.weatherData) return null;
        
        const condition = this.weatherData.condition;
        return this.weatherEffects[condition] || this.weatherEffects.cloudy;
    }

    applyWeatherBonus(species, basePoints, rarity) {
        const weatherEffect = this.getCurrentWeatherEffect();
        if (!weatherEffect) return { points: basePoints, rarity };

        let adjustedPoints = basePoints;
        let adjustedRarity = rarity;

        // Apply species bonus
        if (weatherEffect.bonusSpecies.includes(species)) {
            adjustedPoints = Math.floor(basePoints * weatherEffect.pointMultiplier);
        }

        // Apply rarity boost
        if (weatherEffect.rarityBoost && Math.random() < 0.1) { // 10% chance to apply boost
            const rarityLevels = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
            const currentIndex = rarityLevels.indexOf(rarity);
            
            for (const [boostRarity, chance] of Object.entries(weatherEffect.rarityBoost)) {
                if (Math.random() < chance) {
                    const boostIndex = rarityLevels.indexOf(boostRarity);
                    if (boostIndex > currentIndex) {
                        adjustedRarity = boostRarity;
                        break;
                    }
                }
            }
        }

        return {
            points: adjustedPoints,
            rarity: adjustedRarity,
            weatherBonus: weatherEffect.name
        };
    }

    getLocationString() {
        if (!this.locationData) return 'Unknown Location';
        
        if (this.locationData.fallback) {
            return 'Default Location';
        }
        
        // Simple location formatting (in a real app, you'd reverse geocode)
        return `${this.locationData.latitude.toFixed(3)}°, ${this.locationData.longitude.toFixed(3)}°`;
    }

    shouldRefreshWeather() {
        if (!this.weatherData) return true;
        
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        return (Date.now() - this.weatherData.timestamp) > oneHour;
    }
}
