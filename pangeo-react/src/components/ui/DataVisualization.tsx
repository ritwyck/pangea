import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { BarChart3, PieChart, TrendingUp, Map, FileText, Settings, Share2, Download, Crown, Gem, Diamond, Star, MapPin } from 'lucide-react';
import type { Discovery, Rarity } from '../../types';

interface DataVisualizationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ isOpen, onClose }) => {
  const { gameData } = useGameStore();
  const { discoveries, discoveredSpecies } = gameData;

  const [selectedTab, setSelectedTab] = useState<'map' | 'charts' | 'analytics' | 'export'>('map');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'month' | 'week' | 'day'>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');

  // Filter discoveries based on timeframe
  const getFilteredDiscoveries = () => {
    const now = new Date();
    let startDate: Date;

    switch (selectedTimeframe) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return discoveries;
    }

    return discoveries.filter(d => new Date(d.timestamp) >= startDate);
  };

  const filteredDiscoveries = getFilteredDiscoveries();
  const speciesList = ['all', ...Array.from(new Set(discoveredSpecies.map(s => s.species)))];

  // Calculate statistics
  const stats = {
    totalDiscoveries: filteredDiscoveries.length,
    uniqueSpecies: new Set(filteredDiscoveries.map(d => d.species)).size,
    totalPoints: filteredDiscoveries.reduce((sum, d) => sum + d.points, 0),
    avgConfidence: filteredDiscoveries.length > 0
      ? filteredDiscoveries.reduce((sum, d) => sum + d.confidence, 0) / filteredDiscoveries.length
      : 0,
    rarityBreakdown: {
      common: filteredDiscoveries.filter(d => d.rarity === 'common').length,
      uncommon: filteredDiscoveries.filter(d => d.rarity === 'uncommon').length,
      rare: filteredDiscoveries.filter(d => d.rarity === 'rare').length,
      epic: filteredDiscoveries.filter(d => d.rarity === 'epic').length,
      legendary: filteredDiscoveries.filter(d => d.rarity === 'legendary').length,
    }
  };

  if (!isOpen) return null;

  const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
      case 'legendary': return '#DC2626';
      case 'epic': return '#7C3AED';
      case 'rare': return '#2563EB';
      case 'uncommon': return '#059669';
      default: return '#6B7280';
    }
  };

  const getRarityIcon = (rarity: Rarity) => {
    switch (rarity) {
      case 'legendary': return <Crown size={16} style={{ color: '#FFD700' }} />;
      case 'epic': return <Gem size={16} style={{ color: '#7C3AED' }} />;
      case 'rare': return <Diamond size={16} style={{ color: '#2563EB' }} />;
      case 'uncommon': return <Star size={16} style={{ color: '#059669' }} />;
      default: return <MapPin size={16} style={{ color: '#6B7280' }} />;
    }
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '1200px', maxHeight: '80vh', overflowY: 'auto' }}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close data visualization"
        >
          ×
        </button>

        <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={24} />
          <span>Data Visualization & Research</span>
        </h2>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {[
            { id: 'map', label: 'Discovery Map', icon: <Map size={16} /> },
            { id: 'charts', label: 'Charts', icon: <TrendingUp size={16} /> },
            { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
            { id: 'export', label: 'Export Data', icon: <Download size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              style={{
                padding: '0.75rem 1.25rem',
                background: selectedTab === tab.id ? 'var(--primary-emerald)' : 'var(--bg-secondary)',
                color: selectedTab === tab.id ? 'white' : 'var(--text-primary)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: selectedTab === tab.id ? '0 4px 12px rgba(6, 78, 59, 0.3)' : 'none',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '0.5rem' }}>
              Timeframe:
            </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="all">All Time</option>
              <option value="month">Last Month</option>
              <option value="week">Last Week</option>
              <option value="day">Last Day</option>
            </select>
          </div>

          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '0.5rem' }}>
              Species:
            </label>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
              }}
            >
              {speciesList.map(species => (
                <option key={species} value={species}>
                  {species === 'all' ? 'All Species' : species}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'map' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Map size={20} />
              <span>Discovery Locations</span>
            </h3>

            {/* Map Placeholder - In a real app, this would be Leaflet or Google Maps */}
            <div style={{
              height: '400px',
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              border: '2px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Simulated map background */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, #E0F2FE 0%, #F0F9FF 100%)',
                opacity: 0.5,
              }} />

              {/* Discovery markers */}
              {filteredDiscoveries
                .filter(d => d.latitude && d.longitude)
                .slice(0, 20) // Limit for demo
                .map((discovery, index) => (
                  <div
                    key={discovery.id}
                    style={{
                      position: 'absolute',
                      left: `${20 + (index * 5) % 60}%`,
                      top: `${20 + (index * 7) % 60}%`,
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getRarityColor(discovery.rarity),
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      cursor: 'pointer',
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={`${discovery.species} (${discovery.confidence.toFixed(1)}% confidence)`}
                  />
                ))}

              <div style={{
                textAlign: 'center',
                color: 'var(--text-secondary)',
                zIndex: 1,
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                  Interactive Discovery Map
                </div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {filteredDiscoveries.filter(d => d.latitude && d.longitude).length} discoveries with location data
                </div>
              </div>
            </div>

            {/* Map Legend */}
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              border: '1px solid var(--border-primary)',
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Legend</h4>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as Rarity[]).map(rarity => (
                  <div key={rarity} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getRarityColor(rarity),
                      border: '2px solid white',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {getRarityIcon(rarity)} {rarity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'charts' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              📈 Data Charts
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem',
            }}>
              {/* Rarity Distribution Chart */}
              <div style={{
                background: 'var(--bg-secondary)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)',
              }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  Rarity Distribution
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.entries(stats.rarityBreakdown).map(([rarity, count]) => {
                    const percentage = stats.totalDiscoveries > 0 ? (count / stats.totalDiscoveries) * 100 : 0;
                    return (
                      <div key={rarity} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          minWidth: '80px',
                          fontSize: '0.9rem',
                          color: 'var(--text-secondary)',
                          textTransform: 'capitalize'
                        }}>
                          {getRarityIcon(rarity as Rarity)} {rarity}
                        </div>
                        <div style={{
                          flex: 1,
                          height: '24px',
                          background: 'var(--border-secondary)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: getRarityColor(rarity as Rarity),
                            borderRadius: '12px',
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                        <div style={{
                          minWidth: '60px',
                          textAlign: 'right',
                          fontSize: '0.9rem',
                          color: 'var(--text-primary)',
                          fontWeight: '600'
                        }}>
                          {count} ({percentage.toFixed(1)}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Species Diversity Chart */}
              <div style={{
                background: 'var(--bg-secondary)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)',
              }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  Top Species
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {discoveredSpecies
                    .filter(s => selectedSpecies === 'all' || s.species === selectedSpecies)
                    .slice(0, 8)
                    .map((species) => (
                      <div key={species.species} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          minWidth: '120px',
                          fontSize: '0.9rem',
                          color: 'var(--text-secondary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {species.species}
                        </div>
                        <div style={{
                          flex: 1,
                          height: '20px',
                          background: 'var(--border-secondary)',
                          borderRadius: '10px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${Math.min((species.count / Math.max(...discoveredSpecies.map(s => s.count))) * 100, 100)}%`,
                            height: '100%',
                            background: 'var(--primary-emerald)',
                            borderRadius: '10px',
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                        <div style={{
                          minWidth: '40px',
                          textAlign: 'right',
                          fontSize: '0.9rem',
                          color: 'var(--text-primary)',
                          fontWeight: '600'
                        }}>
                          {species.count}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              📊 Research Analytics
            </h3>

            {/* Key Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}>
              <div style={{
                background: 'var(--bg-secondary)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                  {stats.totalDiscoveries}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Total Discoveries
                </div>
              </div>

              <div style={{
                background: 'var(--bg-secondary)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                  {stats.uniqueSpecies}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Unique Species
                </div>
              </div>

              <div style={{
                background: 'var(--bg-secondary)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                  {stats.totalPoints.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Total Points
                </div>
              </div>

              <div style={{
                background: 'var(--bg-secondary)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                  {stats.avgConfidence.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Avg Confidence
                </div>
              </div>
            </div>

            {/* Research Insights */}
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid var(--border-primary)',
            }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                🔬 Research Insights
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  padding: '1rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-secondary)',
                }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    📈 Activity Trend
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {selectedTimeframe === 'all'
                      ? `You've made ${stats.totalDiscoveries} discoveries total, averaging ${Math.round(stats.totalDiscoveries / Math.max(1, Math.ceil((new Date().getTime() - new Date(discoveries[0]?.timestamp || Date.now()).getTime()) / (1000 * 60 * 60 * 24))))} discoveries per day.`
                      : `In the selected timeframe, you've made ${stats.totalDiscoveries} discoveries across ${stats.uniqueSpecies} species.`
                    }
                  </div>
                </div>

                <div style={{
                  padding: '1rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-secondary)',
                }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    🎯 Detection Quality
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Your average confidence score of {stats.avgConfidence.toFixed(1)}% indicates {
                      stats.avgConfidence >= 90 ? 'excellent' :
                      stats.avgConfidence >= 80 ? 'very good' :
                      stats.avgConfidence >= 70 ? 'good' :
                      'developing'
                    } identification skills. Keep up the great work!
                  </div>
                </div>

                <div style={{
                  padding: '1rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-secondary)',
                }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    🏆 Rarity Achievements
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    You've discovered {stats.rarityBreakdown.legendary + stats.rarityBreakdown.epic} rare species (
                    {stats.rarityBreakdown.legendary} legendary, {stats.rarityBreakdown.epic} epic),
                    contributing valuable data to biodiversity research.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'export' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              💾 Export Research Data
            </h3>

            <div style={{
              background: 'var(--bg-secondary)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid var(--border-primary)',
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Export Your Research Data
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Download your discovery data in various formats for research, backup, or sharing with scientific communities.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
              }}>
                <button
                  style={{
                    padding: '1.5rem',
                    background: 'var(--primary-emerald)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  onClick={() => {
                    // In a real app, this would generate and download CSV
                    alert('CSV export would be implemented here');
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>📄</span>
                  <span>CSV Format</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                    Spreadsheet compatible
                  </span>
                </button>

                <button
                  style={{
                    padding: '1.5rem',
                    background: 'var(--info)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  onClick={() => {
                    // In a real app, this would generate and download JSON
                    alert('JSON export would be implemented here');
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>🔧</span>
                  <span>JSON Format</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                    Developer friendly
                  </span>
                </button>

                <button
                  style={{
                    padding: '1.5rem',
                    background: 'var(--success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  onClick={() => {
                    // In a real app, this would generate and download research report
                    alert('Research report export would be implemented here');
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>📋</span>
                  <span>Research Report</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                    Formatted analysis
                  </span>
                </button>

                <button
                  style={{
                    padding: '1.5rem',
                    background: 'var(--warning)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  onClick={() => {
                    // In a real app, this would share to scientific platforms
                    alert('Scientific platform sharing would be implemented here');
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>🌐</span>
                  <span>Share to Science</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                    Research platforms
                  </span>
                </button>
              </div>

              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'var(--bg-primary)',
                borderRadius: '8px',
                border: '1px solid var(--border-secondary)',
              }}>
                <h5 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  📋 Data Summary
                </h5>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                }}>
                  <div>Discoveries: {stats.totalDiscoveries}</div>
                  <div>Species: {stats.uniqueSpecies}</div>
                  <div>Photos: {filteredDiscoveries.filter(d => d.photo).length}</div>
                  <div>Locations: {filteredDiscoveries.filter(d => d.latitude && d.longitude).length}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', gap: '1rem' }}>
          <button
            className="modal-btn secondary"
            onClick={onClose}
            style={{ marginTop: 0 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
