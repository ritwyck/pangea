import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Search, BookOpen, Users, Flame, Star, Lock, Trophy } from 'lucide-react';
import type { Achievement, AchievementCategory } from '../../types';

interface AchievementsProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryLabels: Record<AchievementCategory, string> = {
  discovery: 'Discovery',
  collection: 'Collection',
  social: 'Social',
  streak: 'Streaks',
  special: 'Special',
};

const categoryIcons: Record<AchievementCategory, React.ReactNode> = {
  discovery: <Search size={16} />,
  collection: <BookOpen size={16} />,
  social: <Users size={16} />,
  streak: <Flame size={16} />,
  special: <Star size={16} />,
};

export const Achievements: React.FC<AchievementsProps> = ({ isOpen, onClose }) => {
  const { gameData } = useGameStore();
  const { achievements } = gameData.userProfile;

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory>('discovery');

  if (!isOpen) return null;

  const categories: AchievementCategory[] = ['discovery', 'collection', 'social', 'streak', 'special'];
  const filteredAchievements = achievements.filter(a => a.category === selectedCategory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-red-500 to-red-700';
      case 'epic': return 'from-purple-500 to-purple-700';
      case 'rare': return 'from-blue-500 to-blue-700';
      case 'uncommon': return 'from-green-500 to-green-700';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'shadow-red-500/50';
      case 'epic': return 'shadow-purple-500/50';
      case 'rare': return 'shadow-blue-500/50';
      case 'uncommon': return 'shadow-green-500/50';
      default: return 'shadow-gray-400/50';
    }
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '900px', maxHeight: '80vh', overflowY: 'auto' }}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close achievements"
        >
          ×
        </button>

        <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={24} />
          <span>Achievements</span>
        </h2>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {categories.map((category) => {
            const categoryAchievements = achievements.filter(a => a.category === category);
            const unlockedCount = categoryAchievements.filter(a => a.unlockedAt).length;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: selectedCategory === category ? 'var(--primary-emerald)' : 'var(--bg-secondary)',
                  color: selectedCategory === category ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: selectedCategory === category ? '0 4px 12px rgba(6, 78, 59, 0.3)' : 'none',
                }}
              >
                <span>{categoryIcons[category]}</span>
                <span>{categoryLabels[category]}</span>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}>
                  {unlockedCount}/{categoryAchievements.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Achievements Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {filteredAchievements.map((achievement) => {
            const isUnlocked = !!achievement.unlockedAt;
            const progress = achievement.progress !== undefined && achievement.target
              ? (achievement.progress / achievement.target) * 100
              : isUnlocked ? 100 : 0;

            return (
              <div
                key={achievement.id}
                style={{
                  background: isUnlocked ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                  border: `2px solid ${isUnlocked ? 'var(--primary-emerald)' : 'var(--border-secondary)'}`,
                  borderRadius: '12px',
                  padding: '1.5rem',
                  position: 'relative',
                  opacity: isUnlocked ? 1 : 0.7,
                  transform: isUnlocked ? 'scale(1)' : 'scale(0.98)',
                  transition: 'all 0.3s ease',
                  boxShadow: isUnlocked ? '0 8px 25px rgba(6, 78, 59, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Rarity Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: `linear-gradient(135deg, var(--${achievement.rarity === 'legendary' ? 'danger' : achievement.rarity === 'epic' ? 'info' : achievement.rarity === 'rare' ? 'info' : 'success'}))`,
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {achievement.rarity}
                </div>

                {/* Achievement Icon */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 1rem auto',
                  borderRadius: '50%',
                  background: isUnlocked ? 'var(--primary-emerald)' : 'var(--border-secondary)',
                  color: 'white',
                  filter: isUnlocked ? 'none' : 'grayscale(100%)',
                  opacity: isUnlocked ? 1 : 0.5,
                }}>
                  {isUnlocked ? (
                    <Trophy size={32} />
                  ) : (
                    <Lock size={32} />
                  )}
                </div>

                {/* Achievement Details */}
                <h3 style={{
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                }}>
                  {achievement.name}
                </h3>

                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  lineHeight: '1.4',
                }}>
                  {achievement.description}
                </p>

                {/* Progress Bar for Locked Achievements */}
                {!isUnlocked && achievement.progress !== undefined && achievement.target && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      color: 'var(--text-tertiary)',
                      marginBottom: '0.5rem',
                    }}>
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.target}</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'var(--border-secondary)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'var(--primary-emerald)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                )}

                {/* Reward Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  fontWeight: '600',
                }}>
                  <Trophy size={16} />
                  <span>+{achievement.points} points</span>
                </div>

                {/* Unlock Date */}
                {isUnlocked && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.5rem',
                    background: 'var(--success)',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    fontWeight: '600',
                  }}>
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}

                {/* Achievement Glow Effect for Rare Items */}
                {isUnlocked && (achievement.rarity === 'legendary' || achievement.rarity === 'epic') && (
                  <div style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: `linear-gradient(45deg, ${achievement.rarity === 'legendary' ? '#dc2626' : '#7c3aed'}, transparent, ${achievement.rarity === 'legendary' ? '#dc2626' : '#7c3aed'})`,
                    borderRadius: '14px',
                    zIndex: -1,
                    opacity: 0.3,
                    animation: 'luxuryPulse 2s infinite',
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--border-primary)',
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Achievement Stats
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                {achievements.filter(a => a.unlockedAt).length}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Unlocked
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                {achievements.length}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Total
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-emerald)' }}>
                {achievements.filter(a => a.unlockedAt).reduce((sum, a) => sum + a.points, 0)}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Points Earned
              </div>
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
