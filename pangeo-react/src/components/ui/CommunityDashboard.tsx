import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Trophy, Users, Target, MapPin, Award, Gift, Globe } from 'lucide-react';
import type { Neighborhood, NeighborhoodMember, CommunityGoal } from '../../types';

interface CommunityDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityDashboard: React.FC<CommunityDashboardProps> = ({ isOpen, onClose }) => {
  const { gameData } = useGameStore();
  const { community, userProfile } = gameData;
  const { userNeighborhood, neighborhoods, communityPool } = community;

  const [selectedTab, setSelectedTab] = useState<'leaderboard' | 'neighborhood' | 'goals'>('leaderboard');

  if (!isOpen) return null;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy size={20} style={{ color: '#FFD700' }} />;
      case 2: return <Award size={20} style={{ color: '#C0C0C0' }} />;
      case 3: return <Award size={20} style={{ color: '#CD7F32' }} />;
      default: return <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>#{rank}</span>;
    }
  };

  const getNeighborhoodRank = (neighborhood: Neighborhood) => {
    return neighborhoods.findIndex(n => n.id === neighborhood.id) + 1;
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '1000px', maxHeight: '80vh', overflowY: 'auto' }}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close community dashboard"
        >
          ×
        </button>

        <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={24} />
          <span>Community Dashboard</span>
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
            { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={16} /> },
            { id: 'neighborhood', label: 'Neighborhood', icon: <MapPin size={16} /> },
            { id: 'goals', label: 'Community Goals', icon: <Target size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              style={{
                padding: '0.75rem 1.25rem',
                background: selectedTab === tab.id ? 'var(--primary-sage)' : 'var(--bg-secondary)',
                color: selectedTab === tab.id ? 'var(--text-inverse)' : 'var(--text-primary)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: selectedTab === tab.id ? '0 4px 12px rgba(122, 155, 122, 0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'leaderboard' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={20} />
              <span>Global Leaderboard</span>
            </h3>

            {/* Top 3 Podium */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem',
              marginBottom: '2rem',
              alignItems: 'end'
            }}>
              {neighborhoods.slice(0, 3).map((neighborhood, index) => {
                const position = index + 1;
                const height = position === 1 ? '120px' : position === 2 ? '100px' : '80px';

                return (
                  <div
                    key={neighborhood.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center',
                      border: position === 1 ? '3px solid var(--luxury-gold)' : '2px solid var(--border-primary)',
                      position: 'relative',
                      minHeight: height,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div style={{
                      fontSize: '2rem',
                      marginBottom: '0.5rem',
                      opacity: position === 1 ? 1 : 0.8
                    }}>
                      {getRankIcon(position)}
                    </div>
                    <h4 style={{
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      fontWeight: '700',
                      marginBottom: '0.5rem'
                    }}>
                      {neighborhood.name}
                    </h4>
                    <div style={{
                      color: 'var(--primary-emerald)',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}>
                      {neighborhood.totalPoints.toLocaleString()} pts
                    </div>
                    <div style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      marginTop: '0.25rem'
                    }}>
                      {neighborhood.memberCount} members
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full Leaderboard */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {neighborhoods.map((neighborhood, index) => {
                const rank = index + 1;
                const isUserNeighborhood = userNeighborhood?.id === neighborhood.id;

                return (
                  <div
                    key={neighborhood.id}
                    style={{
                      background: isUserNeighborhood ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                      border: isUserNeighborhood ? '2px solid var(--primary-emerald)' : '1px solid var(--border-primary)',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: 'var(--text-secondary)',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>
                      {getRankIcon(rank)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        {neighborhood.name}
                        {isUserNeighborhood && (
                          <span style={{
                            marginLeft: '0.5rem',
                            background: 'var(--primary-emerald)',
                            color: 'white',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}>
                            YOUR NEIGHBORHOOD
                          </span>
                        )}
                      </h4>
                      <div style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem'
                      }}>
                        {neighborhood.memberCount} members • Avg: {neighborhood.avgPointsPerMember} pts/member
                      </div>
                    </div>

                    <div style={{
                      textAlign: 'right',
                      color: 'var(--primary-emerald)',
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}>
                      {neighborhood.totalPoints.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedTab === 'neighborhood' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} />
              <span>Your Neighborhood</span>
            </h3>

            {userNeighborhood ? (
              <div>
                {/* Neighborhood Overview */}
                <div style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '2rem',
                  border: '2px solid var(--primary-emerald)'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                        #{getNeighborhoodRank(userNeighborhood)}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Global Rank
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                        {userNeighborhood.totalPoints.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Total Points
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                        {userNeighborhood.memberCount}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Members
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                        {userNeighborhood.avgPointsPerMember}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Avg Points/Member
                      </div>
                    </div>
                  </div>

                  <h4 style={{
                    color: 'var(--text-primary)',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <MapPin size={20} />
                    <span>{userNeighborhood.name}</span>
                  </h4>
                </div>

                {/* Member Leaderboard */}
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} />
                  <span>Neighborhood Members</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {userNeighborhood.members.map((member, index) => (
                    <div
                      key={member.username}
                      style={{
                        background: member.isCurrentUser ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                        border: member.isCurrentUser ? '2px solid var(--primary-emerald)' : '1px solid var(--border-primary)',
                        borderRadius: '8px',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: 'var(--text-secondary)',
                        minWidth: '30px',
                        textAlign: 'center'
                      }}>
                        #{index + 1}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{
                          color: 'var(--text-primary)',
                          fontSize: '1rem',
                          fontWeight: member.isCurrentUser ? '700' : '600'
                        }}>
                          {member.username}
                          {member.isCurrentUser && (
                            <span style={{
                              marginLeft: '0.5rem',
                              background: 'var(--primary-emerald)',
                              color: 'white',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '8px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold'
                            }}>
                              YOU
                            </span>
                          )}
                        </div>
                        <div style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.8rem'
                        }}>
                          Joined {new Date(member.joinDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div style={{
                        color: 'var(--primary-emerald)',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        textAlign: 'right'
                      }}>
                        {member.points.toLocaleString()} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-tertiary)',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <MapPin size={48} />
                </div>
                <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  Not part of a neighborhood yet
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                  Join a neighborhood to compete with local nature enthusiasts!
                </div>
                <button
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'var(--primary-emerald)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                >
                  Find Neighborhood
                </button>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'goals' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} />
              <span>Community Goals</span>
            </h3>

            {/* Community Pool Stats */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid var(--border-primary)',
            }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Gift size={18} />
                <span>Community Pool</span>
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                    {communityPool.totalPoints.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Total Points
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                    {communityPool.individualRedemptions.length}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Available Rewards
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                    {communityPool.communityGoals.length}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Active Goals
                  </div>
                </div>
              </div>
            </div>

            {/* Community Goals */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={18} />
                <span>Active Community Goals</span>
              </h4>

              {communityPool.communityGoals.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: 'var(--text-tertiary)',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-primary)',
                }}>
                  No active community goals at the moment.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {communityPool.communityGoals.map((goal) => {
                    const progress = (goal.currentPoints / goal.targetPoints) * 100;

                    return (
                      <div
                        key={goal.id}
                        style={{
                          background: 'var(--bg-secondary)',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          border: '1px solid var(--border-primary)',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '1rem',
                        }}>
                          <div style={{ flex: 1 }}>
                            <h5 style={{
                              color: 'var(--text-primary)',
                              fontSize: '1.1rem',
                              fontWeight: '700',
                              marginBottom: '0.5rem'
                            }}>
                              {goal.name}
                            </h5>
                            <p style={{
                              color: 'var(--text-secondary)',
                              fontSize: '0.9rem',
                              lineHeight: '1.4'
                            }}>
                              {goal.description}
                            </p>
                          </div>
                          <div style={{
                            color: 'var(--text-tertiary)',
                            fontSize: '0.8rem',
                            textAlign: 'right'
                          }}>
                            Ends: {new Date(goal.deadline).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '0.5rem',
                          }}>
                            <span>Progress</span>
                            <span>{goal.currentPoints.toLocaleString()} / {goal.targetPoints.toLocaleString()}</span>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '12px',
                            background: 'var(--border-secondary)',
                            borderRadius: '6px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${Math.min(progress, 100)}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, var(--primary-emerald), var(--accent-emerald))',
                              borderRadius: '6px',
                              transition: 'width 0.5s ease',
                            }} />
                          </div>
                        </div>

                        {/* Rewards */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                        }}>
                          {goal.rewards.map((reward, index) => (
                            <div
                              key={index}
                              style={{
                                background: reward.type === 'individual' ? 'var(--info)' : 'var(--success)',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                              }}
                            >
                              {reward.type === 'individual' ? <Users size={12} /> : <Globe size={12} />} {reward.reward} ({reward.cost} pts)
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Available Rewards */}
            <div>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Gift size={18} />
                <span>Available Rewards</span>
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
              }}>
                {communityPool.individualRedemptions.map((reward) => (
                  <div
                    key={reward.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    <h5 style={{
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      fontWeight: '700',
                      marginBottom: '0.5rem'
                    }}>
                      {reward.name}
                    </h5>
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      marginBottom: '1rem',
                      lineHeight: '1.4'
                    }}>
                      {reward.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        color: 'var(--primary-emerald)',
                        fontSize: '1.1rem',
                        fontWeight: 'bold'
                      }}>
                        {reward.cost.toLocaleString()} pts
                      </div>
                      <div style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '0.8rem'
                      }}>
                        {reward.category}
                      </div>
                    </div>
                  </div>
                ))}
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
