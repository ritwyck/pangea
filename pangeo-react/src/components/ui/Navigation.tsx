import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Trophy, Target, Users, BarChart3, Settings } from 'lucide-react';

interface NavigationProps {
  onSettingsClick: () => void;
  onAchievementsClick: () => void;
  onProgressClick: () => void;
  onCommunityClick: () => void;
  onDataClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onSettingsClick,
  onAchievementsClick,
  onProgressClick,
  onCommunityClick,
  onDataClick
}) => {
  const { gameData } = useGameStore();

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav className="nav-bar" role="navigation" aria-label="Main navigation">
        <div className="nav-content">
          {/* Left side - Logo */}
          <div className="nav-left">
            <h1>PanGEO</h1>
          </div>

          {/* Center - User Stats */}
          <div className="nav-center">
            <div className="user-stats">
              <div className="points" aria-label={`Total points: ${gameData.userProfile.totalPoints}`}>
                {gameData.userProfile.totalPoints} pts
              </div>
              <div className="discoveries" aria-label={`Total discoveries: ${gameData.discoveries.length}`}>
                {gameData.discoveries.length} discoveries
              </div>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="nav-right">
            <div className="nav-actions">
              <button
                onClick={onAchievementsClick}
                style={{
                  background: 'var(--accent-terracotta)',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  boxShadow: 'var(--soft-shadow)',
                  transition: 'all 0.2s ease',
                }}
                aria-label="View achievements"
              >
                <Trophy size={20} />
              </button>

              <button
                onClick={onProgressClick}
                style={{
                  background: 'var(--primary-sage)',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  boxShadow: 'var(--soft-shadow)',
                  transition: 'all 0.2s ease',
                }}
                aria-label="View progress and challenges"
              >
                <Target size={20} />
              </button>

              <button
                onClick={onCommunityClick}
                style={{
                  background: 'var(--primary-sage)',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  boxShadow: 'var(--soft-shadow)',
                  transition: 'all 0.2s ease',
                }}
                aria-label="View community dashboard"
              >
                <Users size={20} />
              </button>

              <button
                onClick={onDataClick}
                style={{
                  background: 'var(--accent-terracotta)',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  boxShadow: 'var(--soft-shadow)',
                  transition: 'all 0.2s ease',
                }}
                aria-label="View data visualization and research"
              >
                <BarChart3 size={20} />
              </button>

              <button
                onClick={onSettingsClick}
                style={{
                  background: 'var(--warm-beige)',
                  color: 'var(--text-primary)',
                  border: '2px solid var(--border-primary)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  boxShadow: 'var(--soft-shadow)',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Open settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
