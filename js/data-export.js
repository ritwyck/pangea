class DataExportSystem {
    constructor() {
        this.exportFormats = ['csv', 'json', 'geojson'];
        this.anonymizationMethods = this.initializeAnonymizationMethods();
    }

    initializeAnonymizationMethods() {
        return {
            location: {
                precision_reduction: (lat, lng, precision = 3) => {
                    // Reduce coordinate precision (e.g., 50.0755123 -> 50.076)
                    return {
                        lat: parseFloat(lat.toFixed(precision)),
                        lng: parseFloat(lng.toFixed(precision))
                    };
                },
                grid_snapping: (lat, lng, gridSize = 0.01) => {
                    // Snap to grid points (~1km grid)
                    return {
                        lat: Math.round(lat / gridSize) * gridSize,
                        lng: Math.round(lng / gridSize) * gridSize
                    };
                },
                area_generalization: (lat, lng) => {
                    // Group into broader areas (e.g., district level)
                    return this.getDistrictFromCoordinates(lat, lng);
                }
            },
            temporal: {
                hour_generalization: (timestamp) => {
                    // Remove minutes/seconds, keep only date + hour
                    const date = new Date(timestamp);
                    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).toISOString();
                },
                day_generalization: (timestamp) => {
                    // Remove time, keep only date
                    const date = new Date(timestamp);
                    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
                },
                season_generalization: (timestamp) => {
                    // Convert to season + year
                    const date = new Date(timestamp);
                    const month = date.getMonth();
                    let season = 'winter';
                    if (month >= 2 && month <= 4) season = 'spring';
                    else if (month >= 5 && month <= 7) season = 'summer';
                    else if (month >= 8 && month <= 10) season = 'autumn';
                    return `${season}_${date.getFullYear()}`;
                }
            }
        };
    }

    async exportData(filters, anonymizationSettings, format = 'csv') {
        try {
            // Get discovery data
            const rawData = this.getRawDiscoveryData();
            
            // Apply filters
            const filteredData = this.applyFilters(rawData, filters);
            
            // Anonymize data
            const anonymizedData = this.anonymizeData(filteredData, anonymizationSettings);
            
            // Format and export
            const exportData = this.formatForExport(anonymizedData, format);
            const filename = this.generateFilename(filters, format);
            
            // Download file
            this.downloadFile(exportData, filename, format);
            
            // Log export for transparency
            this.logExport(filters, anonymizationSettings, anonymizedData.length);
            
            return {
                success: true,
                recordsExported: anonymizedData.length,
                filename: filename
            };
            
        } catch (error) {
            console.error('Export failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    getRawDiscoveryData() {
        // Get data from game storage
        const gameData = JSON.parse(localStorage.getItem('insectDetectionGame'));
        const discoveries = gameData?.discoveredSpecies || [];
        
        // Add mock community data for demonstration
        const communityData = this.generateMockCommunityData();
        
        return [...discoveries, ...communityData];
    }

    generateMockCommunityData() {
        const mockData = [];
        const species = ['Butterfly', 'Bee', 'Rose', 'Oak Leaf', 'Spider', 'Beetle', 'Sunflower', 'Pine Cone'];
        const weather = ['sunny', 'cloudy', 'rainy', 'overcast'];
        const baseTime = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days ago
        
        for (let i = 0; i < 200; i++) {
            mockData.push({
                id: `community_${i}`,
                species: species[Math.floor(Math.random() * species.length)],
                lat: 50.0755 + (Math.random() - 0.5) * 0.1, // ~5km radius
                lng: 14.4378 + (Math.random() - 0.5) * 0.1,
                timestamp: new Date(baseTime + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                weather: weather[Math.floor(Math.random() * weather.length)],
                confidence: Math.floor(Math.random() * 30) + 70,
                rarity: this.getRandomRarity(),
                points: Math.floor(Math.random() * 100) + 20,
                source: 'community'
            });
        }
        
        return mockData;
    }

    getRandomRarity() {
        const rand = Math.random();
        if (rand < 0.6) return 'common';
        if (rand < 0.8) return 'uncommon';
        if (rand < 0.93) return 'rare';
        if (rand < 0.98) return 'epic';
        return 'legendary';
    }

    applyFilters(data, filters) {
        let filtered = [...data];
        
        // Species filter
        if (filters.species && filters.species.length > 0) {
            filtered = filtered.filter(d => filters.species.includes(d.species));
        }
        
        // Date range filter
        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            filtered = filtered.filter(d => new Date(d.timestamp) >= startDate);
        }
        
        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            filtered = filtered.filter(d => new Date(d.timestamp) <= endDate);
        }
        
        // Weather filter
        if (filters.weather && filters.weather.length > 0) {
            filtered = filtered.filter(d => filters.weather.includes(d.weather));
        }
        
        // Rarity filter
        if (filters.rarity && filters.rarity.length > 0) {
            filtered = filtered.filter(d => filters.rarity.includes(d.rarity || 'common'));
        }
        
        // Confidence threshold
        if (filters.minConfidence) {
            filtered = filtered.filter(d => (d.confidence || 0) >= filters.minConfidence);
        }
        
        // Geographic bounds
        if (filters.bounds) {
            filtered = filtered.filter(d => 
                d.lat >= filters.bounds.south &&
                d.lat <= filters.bounds.north &&
                d.lng >= filters.bounds.west &&
                d.lng <= filters.bounds.east
            );
        }
        
        return filtered;
    }

    anonymizeData(data, settings) {
        return data.map(record => {
            const anonymized = { ...record };
            
            // Remove or hash user identifiers
            delete anonymized.id;
            delete anonymized.photo; // Remove photos for privacy
            delete anonymized.user;
            delete anonymized.username;
            
            // Anonymize location based on settings
            if (settings.location && record.lat && record.lng) {
                const method = this.anonymizationMethods.location[settings.location.method];
                if (method) {
                    const anonymizedLocation = method(record.lat, record.lng, settings.location.parameter);
                    anonymized.lat = anonymizedLocation.lat;
                    anonymized.lng = anonymizedLocation.lng;
                }
            }
            
            // Anonymize temporal data
            if (settings.temporal && record.timestamp) {
                const method = this.anonymizationMethods.temporal[settings.temporal.method];
                if (method) {
                    anonymized.timestamp = method(record.timestamp);
                }
            }
            
            // Add data quality indicators
            anonymized.data_quality = this.calculateDataQuality(record);
            anonymized.anonymization_level = this.getAnonymizationLevel(settings);
            
            return anonymized;
        });
    }

    calculateDataQuality(record) {
        let score = 0;
        if (record.confidence >= 90) score += 3;
        else if (record.confidence >= 75) score += 2;
        else if (record.confidence >= 60) score += 1;
        
        if (record.lat && record.lng) score += 2;
        if (record.weather) score += 1;
        if (record.rarity) score += 1;
        
        return Math.min(10, score); // Scale 0-10
    }

    getAnonymizationLevel(settings) {
        let level = 'minimal';
        
        if (settings.location?.method === 'area_generalization' || 
            settings.temporal?.method === 'season_generalization') {
            level = 'high';
        } else if (settings.location?.method === 'grid_snapping' || 
                   settings.temporal?.method === 'day_generalization') {
            level = 'medium';
        }
        
        return level;
    }

    formatForExport(data, format) {
        switch (format) {
            case 'csv':
                return this.formatAsCSV(data);
            case 'json':
                return this.formatAsJSON(data);
            case 'geojson':
                return this.formatAsGeoJSON(data);
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    formatAsCSV(data) {
        if (data.length === 0) return '';
        
        // Get all unique keys
        const headers = [...new Set(data.flatMap(Object.keys))];
        
        // Create CSV content
        const csvHeaders = headers.join(',');
        const csvRows = data.map(row => 
            headers.map(header => {
                const value = row[header] || '';
                // Escape commas and quotes
                return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
                    ? `"${value.replace(/"/g, '""')}"` 
                    : value;
            }).join(',')
        );
        
        return [csvHeaders, ...csvRows].join('\n');
    }

    formatAsJSON(data) {
        return JSON.stringify({
            metadata: {
                exportDate: new Date().toISOString(),
                recordCount: data.length,
                source: 'Nature Detective Community',
                dataLicense: 'CC BY-SA 4.0',
                anonymization: 'Applied for privacy protection'
            },
            data: data
        }, null, 2);
    }

    formatAsGeoJSON(data) {
        const features = data
            .filter(d => d.lat && d.lng)
            .map(d => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [d.lng, d.lat]
                },
                properties: {
                    species: d.species,
                    timestamp: d.timestamp,
                    weather: d.weather,
                    confidence: d.confidence,
                    rarity: d.rarity,
                    points: d.points,
                    data_quality: d.data_quality,
                    anonymization_level: d.anonymization_level
                }
            }));
        
        return JSON.stringify({
            type: 'FeatureCollection',
            metadata: {
                exportDate: new Date().toISOString(),
                recordCount: features.length,
                source: 'PanGEO Community',
                crs: 'EPSG:4326'
            },
            features: features
        }, null, 2);
    }

    generateFilename(filters, format) {
        const date = new Date().toISOString().split('T')[0];
        const species = filters.species?.join('-') || 'all-species';
        const timeRange = filters.startDate ? 
            `${filters.startDate}_to_${filters.endDate || 'latest'}` : 
            'all-time';
        
        return `nature-detective-data_${species}_${timeRange}_${date}.${format}`;
    }

    downloadFile(content, filename, format) {
        const mimeTypes = {
            'csv': 'text/csv',
            'json': 'application/json',
            'geojson': 'application/geo+json'
        };
        
        const blob = new Blob([content], { type: mimeTypes[format] || 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    logExport(filters, anonymizationSettings, recordCount) {
        const exportLog = {
            timestamp: new Date().toISOString(),
            filters: filters,
            anonymization: anonymizationSettings,
            recordCount: recordCount,
            user: 'anonymous' // Always anonymous in logs
        };
        
        // In a real app, this would be sent to a server for transparency
        console.log('Data export logged:', exportLog);
        
        // Store locally for user's reference
        const existingLogs = JSON.parse(localStorage.getItem('dataExportLogs') || '[]');
        existingLogs.push(exportLog);
        localStorage.setItem('dataExportLogs', JSON.stringify(existingLogs.slice(-50))); // Keep last 50 exports
    }

    getDistrictFromCoordinates(lat, lng) {
        // Simplified district mapping for Prague
        // In a real app, this would use proper geospatial data
        const districts = [
            { name: 'Prague_1', bounds: { minLat: 50.075, maxLat: 50.095, minLng: 14.42, maxLng: 14.45 } },
            { name: 'Prague_2', bounds: { minLat: 50.065, maxLat: 50.085, minLng: 14.41, maxLng: 14.44 } },
            { name: 'Prague_3', bounds: { minLat: 50.07, maxLat: 50.09, minLng: 14.45, maxLng: 14.48 } },
            // Add more districts as needed
        ];
        
        for (const district of districts) {
            if (lat >= district.bounds.minLat && lat <= district.bounds.maxLat &&
                lng >= district.bounds.minLng && lng <= district.bounds.maxLng) {
                return district.name;
            }
        }
        
        return 'Prague_Other';
    }

    getAvailableSpecies() {
        const data = this.getRawDiscoveryData();
        return [...new Set(data.map(d => d.species))].sort();
    }

    getDataDateRange() {
        const data = this.getRawDiscoveryData();
        const dates = data.map(d => new Date(d.timestamp)).sort();
        
        return {
            earliest: dates[0]?.toISOString().split('T')[0] || null,
            latest: dates[dates.length - 1]?.toISOString().split('T')[0] || null
        };
    }

    getExportStats() {
        const logs = JSON.parse(localStorage.getItem('dataExportLogs') || '[]');
        return {
            totalExports: logs.length,
            lastExport: logs[logs.length - 1]?.timestamp || null,
            totalRecordsExported: logs.reduce((sum, log) => sum + log.recordCount, 0)
        };
    }
}
