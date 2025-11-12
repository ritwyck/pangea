import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Calendar, BarChart3, TreePine, Trophy, Flame, Zap, Star, Sparkles, Sprout, Clock, Target, Gift } from 'lucide-react';
import type { Challenge, ChallengeType } from '../../types';

interface ProgressProps {
  isOpen: boolean;
  onClose: () => void;
}

const challengeTypeLabels: Record<ChallengeType, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  seasonal: 'Seasonal',
  achievement: 'Achievement',
};

const challengeTypeIcons: Record<ChallengeType, React.ReactElement> = {
  daily: <Calendar size={16} />,
  weekly: <BarChart3 size={16} />,
  seasonal: <TreePine size={16} />,
  achievement: <Trophy size={16} />,
};

const challengeTypeColors: Record<ChallengeType, string> = {
  daily: 'var(--primary-sage)',
  weekly: 'var(--accent-terracotta)',
  seasonal: 'var(--primary-sage)',
  achievement: 'var(--primary-sage)',
};

export const Progress: React.FC<ProgressProps> = ({ isOpen, onClose }) => {
  const { gameData, dailyChallenges } = useGameStore();
  const { userProfile } = gameData;

  const [selectedType, setSelectedType] = useState<ChallengeType>('daily');
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Calculate time left for daily reset
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const types: ChallengeType[] = ['daily', 'weekly', 'seasonal', 'achievement'];
  const filteredChallenges = dailyChallenges.filter(c => c.type === selectedType);

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return 'var(--success)';
    if (percentage >= 75) return 'var(--warning)';
    return 'var(--info)';
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <Flame size={20} style={{ color: '#EF4444' }} />;
    if (streak >= 14) return <Zap size={20} style={{ color: '#F59E0B' }} />;
    if (streak >= 7) return <Star size={20} style={{ color: '#F59E0B' }} />;
    if (streak >= 3) return <Sparkles size={20} style={{ color: '#8B5CF6' }} />;
    return <Sprout size={20} style={{ color: '#10B981' }} />;
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '900px', maxHeight: '80vh', overflowY: 'auto' }}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close progress"
        >
          ×
        </button>

        <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={24} />
          <span>Progress & Challenges</span>
        </h2>

        {/* User Stats Overview */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid var(--border-primary)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1.5rem',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                {userProfile.level}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Level
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                {userProfile.totalXP}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                XP
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--primary-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                {getStreakIcon(userProfile.streakData.daily)}
                {userProfile.streakData.daily}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Day Streak
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                {userProfile.achievements.filter(a => a.unlockedAt).length}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Achievements
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Type Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {types.map((type) => {
            const typeChallenges = dailyChallenges.filter(c => c.type === type);
            const completedCount = typeChallenges.filter(c => c.completed).length;

            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: selectedType === type ? challengeTypeColors[type] : 'var(--bg-secondary)',
                  color: selectedType === type ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: selectedType === type ? '0 4px 12px rgba(6, 78, 59, 0.3)' : 'none',
                }}
              >
                <span>{challengeTypeIcons[type]}</span>
                {type !== 'achievement' && <span>{challengeTypeLabels[type]}</span>}
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}>
                  {completedCount}/{typeChallenges.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time Remaining for Daily Challenges */}
        {selectedType === 'daily' && (
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-secondary)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Clock size={16} />
              <span>Next reset in: <strong>{timeLeft}</strong></span>
            </div>
          </div>
        )}

        {/* Challenges List */}
        <div style={{ marginBottom: '2rem' }}>
          {filteredChallenges.length === 0 ? (
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
                <Target size={48} />
              </div>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                No {challengeTypeLabels[selectedType].toLowerCase()} challenges available
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                Check back later for new challenges!
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredChallenges.map((challenge) => {
                const progress = (challenge.current / challenge.target) * 100;
                const isCompleted = challenge.completed;

                return (
                  <div
                    key={challenge.id}
                    style={{
                      background: isCompleted ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                      border: `2px solid ${isCompleted ? 'var(--success)' : 'var(--border-secondary)'}`,
                      borderRadius: '12px',
                      padding: '1.5rem',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      boxShadow: isCompleted ? '0 4px 12px rgba(34, 197, 94, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {/* Completion Badge */}
                    {isCompleted && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'var(--success)',
                        color: 'white',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                      }}>
                        ✓
                      </div>
                    )}

                    {/* Challenge Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem',
                    }}>
                      <div style={{ fontSize: '1.5rem' }}>
                        {challengeTypeIcons[challenge.type]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          color: 'var(--text-primary)',
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          marginBottom: '0.25rem',
                        }}>
                          {challenge.name}
                        </h3>
                        <p style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.9rem',
                          lineHeight: '1.4',
                        }}>
                          {challenge.description}
                        </p>
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
                        <span>{challenge.current} / {challenge.target}</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '12px',
                        background: 'var(--border-secondary)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}>
                        <div style={{
                          width: `${Math.min(progress, 100)}%`,
                          height: '100%',
                          background: getProgressColor(challenge.current, challenge.target),
                          borderRadius: '6px',
                          transition: 'width 0.5s ease',
                        }} />
                        {isCompleted && (
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rewards */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-secondary)',
                      }}>
                        <Gift size={16} />
                        <span>Rewards: +{challenge.reward.points} pts, +{challenge.reward.xp} XP</span>
                        {challenge.reward.title && (
                          <span style={{
                            background: 'var(--luxury-gold)',
                            color: 'white',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '8px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                          }}>
                            {challenge.reward.title}
                          </span>
                        )}
                      </div>

                      {/* Expiry Time */}
                      {challenge.expiresAt && (
                        <div style={{
                          color: 'var(--text-tertiary)',
                          fontSize: '0.8rem',
                        }}>
                          Expires: {new Date(challenge.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Completion Animation */}
                    {isCompleted && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        right: '10px',
                        bottom: '10px',
                        background: 'linear-gradient(45deg, transparent, rgba(34, 197, 94, 0.1), transparent)',
                        borderRadius: '8px',
                        animation: 'luxuryPulse 2s infinite',
                        pointerEvents: 'none',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* XP Progress to Next Level */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--border-primary)',
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Level Progress
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
            }}>
              <span>Level {userProfile.level}</span>
              <span>{userProfile.totalXP} XP</span>
            </div>
            <div style={{
              width: '100%',
              height: '16px',
              background: 'var(--border-secondary)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${(userProfile.totalXP % 1000) / 10}%`, // Simplified progress calculation
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary-green), var(--accent-green))',
                borderRadius: '8px',
                transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{
              textAlign: 'center',
              fontSize: '0.8rem',
              color: 'var(--text-tertiary)',
              marginTop: '0.5rem',
            }}>
              {1000 - (userProfile.totalXP % 1000)} XP to next level
            </div>
          </div>
        </div>

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
