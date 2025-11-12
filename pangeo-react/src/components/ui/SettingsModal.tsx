import React from 'react';
import { useTheme } from './ThemeProvider';
import { useGameStore } from '../../stores/gameStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, isHighContrast, fontSize, reducedMotion, toggleTheme, setHighContrast, setFontSize, setReducedMotion } = useTheme();
  const { gameData, updateGameData } = useGameStore();
  const { settings } = gameData;

  if (!isOpen) return null;

  const handleSoundToggle = () => {
    updateGameData({
      settings: {
        ...settings,
        soundEnabled: !settings.soundEnabled,
      },
    });
  };

  const handleNotificationsToggle = () => {
    updateGameData({
      settings: {
        ...settings,
        notificationsEnabled: !settings.notificationsEnabled,
      },
    });
  };

  const handleLocationToggle = () => {
    updateGameData({
      settings: {
        ...settings,
        locationEnabled: !settings.locationEnabled,
      },
    });
  };

  const handleAutoDetectionToggle = () => {
    updateGameData({
      settings: {
        ...settings,
        autoDetection: !settings.autoDetection,
      },
    });
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close settings"
        >
          ×
        </button>

        <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>
          Settings
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Theme Settings */}
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.25rem' }}>
              Appearance
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="theme-toggle" style={{ color: 'var(--text-secondary)' }}>
                  Dark Mode
                </label>
                <button
                  id="theme-toggle"
                  onClick={toggleTheme}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--primary-sage)',
                    color: 'var(--text-inverse)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="contrast-toggle" style={{ color: 'var(--text-secondary)' }}>
                  High Contrast
                </label>
                <button
                  id="contrast-toggle"
                  onClick={() => setHighContrast(!isHighContrast)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: isHighContrast ? 'var(--primary-sage)' : 'var(--border-secondary)',
                    color: isHighContrast ? 'var(--text-inverse)' : 'var(--text-primary)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isHighContrast ? 'On' : 'Off'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ color: 'var(--text-secondary)' }}>
                  Font Size
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: fontSize === size ? 'var(--primary-sage)' : 'var(--border-secondary)',
                        color: fontSize === size ? 'var(--text-inverse)' : 'var(--text-primary)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="motion-toggle" style={{ color: 'var(--text-secondary)' }}>
                  Reduced Motion
                </label>
                <button
                  id="motion-toggle"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: reducedMotion ? 'var(--primary-sage)' : 'var(--border-secondary)',
                    color: reducedMotion ? 'var(--text-inverse)' : 'var(--text-primary)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {reducedMotion ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>

          {/* App Settings */}
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.25rem' }}>
              App Settings
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="sound-toggle" style={{ color: 'var(--text-secondary)' }}>
                  Sound Effects
                </label>
                <button
                  id="sound-toggle"
                  onClick={handleSoundToggle}
                  style={{
                    padding: '0.5rem 1rem',
                    background: settings.soundEnabled ? 'var(--primary-sage)' : 'var(--border-secondary)',
                    color: settings.soundEnabled ? 'var(--text-inverse)' : 'var(--text-primary)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {settings.soundEnabled ? 'On' : 'Off'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="notifications-toggle" style={{ color: 'var(--text-secondary)' }}>
                  Notifications
                </label>
                <button
                  id="notifications-toggle"
                  onClick={handleNotificationsToggle}
                  style={{
                    padding: '0.5rem 1rem',
                    background: settings.notificationsEnabled ? 'var(--primary-sage)' : 'var(--border-secondary)',
                    color: settings.notificationsEnabled ? 'var(--text-inverse)' : 'var(--text-primary)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {settings.notificationsEnabled ? 'On' : 'Off'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="location-toggle" style={{ color: 'var(--text-secondary)' }}>
                  Location Services
                </label>
                <button
                  id="location-toggle"
                  onClick={handleLocationToggle}
                  style={{
                    padding: '0.5rem 1rem',
                    background: settings.locationEnabled ? 'var(--primary-sage)' : 'var(--border-secondary)',
                    color: settings.locationEnabled ? 'var(--text-inverse)' : 'var(--text-primary)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {settings.locationEnabled ? 'On' : 'Off'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="detection-toggle" style={{ color: 'var(--text-secondary)' }}>
                  Auto Detection
                </label>
                <button
                  id="detection-toggle"
                  onClick={handleAutoDetectionToggle}
                  style={{
                    padding: '0.5rem 1rem',
                    background: settings.autoDetection ? 'var(--primary-sage)' : 'var(--border-secondary)',
                    color: settings.autoDetection ? 'var(--text-inverse)' : 'var(--text-primary)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {settings.autoDetection ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>

          {/* Camera Settings */}
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.25rem' }}>
              Camera
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ color: 'var(--text-secondary)' }}>
                Camera Facing
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['environment', 'user'] as const).map((facing) => (
                  <button
                    key={facing}
                    onClick={() => updateGameData({
                      settings: {
                        ...settings,
                        cameraFacingMode: facing,
                      },
                    })}
                    style={{
                      padding: '0.5rem 1rem',
                      background: settings.cameraFacingMode === facing ? 'var(--primary-sage)' : 'var(--border-secondary)',
                      color: settings.cameraFacingMode === facing ? 'var(--text-inverse)' : 'var(--text-primary)',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {facing === 'environment' ? 'Back' : 'Front'}
                  </button>
                ))}
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
