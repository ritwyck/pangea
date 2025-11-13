import React, { useEffect, useState } from 'react';
import { useGameStore } from './stores/gameStore';
import { useCamera } from './hooks/useCamera';
import { useDetection } from './hooks/useDetection';
import { ThemeProvider } from './components/ui/ThemeProvider';
import { Navigation } from './components/ui/Navigation';
import { GameScreen } from './components/ui/GameScreen';
import { CollectionScreen } from './components/ui/CollectionScreen';
import { SettingsModal } from './components/ui/SettingsModal';
import { Achievements } from './components/ui/Achievements';
import { Progress } from './components/ui/Progress';
import { CommunityDashboard } from './components/ui/CommunityDashboard';
import { DataVisualization } from './components/ui/DataVisualization';

import { Modal } from './components/ui/Modal';
import './styles.css';

function App() {
  const {
    currentScreen,
    notifications,
    modal,
    isGameActive,
    initializeGame,
    setCurrentScreen,
    removeNotification,
    closeModal,
    setGameActive,
  } = useGameStore();

  const camera = useCamera();
  const detection = useDetection();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isDataOpen, setIsDataOpen] = useState(false);

  // Initialize the game on mount
  useEffect(() => {
    initializeGame();
    setIsInitialized(true);
  }, [initializeGame]);

  // Handle camera and detection lifecycle
  useEffect(() => {
    if (isGameActive && camera.isReady && currentScreen === 'game') {
      detection.startDetection();
    } else {
      detection.stopDetection();
    }
  }, [isGameActive, camera.isReady, currentScreen, detection]);

  // Handle screen changes - restart camera when returning to game screen
  useEffect(() => {
    if (currentScreen === 'game' && isGameActive) {
      // Always try to start camera when on game screen and game is active
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        camera.startCamera();
      }, 100);
      return () => clearTimeout(timer);
    } else if (currentScreen !== 'game') {
      // Stop camera when leaving game screen
      camera.stopCamera();
    }
  }, [currentScreen, isGameActive, camera]);

  // Handle visibility change (like the original app)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isGameActive) {
        detection.stopDetection();
      } else if (!document.hidden && isGameActive && camera.isReady && currentScreen === 'game') {
        detection.startDetection();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isGameActive, camera.isReady, currentScreen, detection]);

  const handleStartGame = async () => {
    const cameraStarted = await camera.startCamera();
    if (cameraStarted) {
      setGameActive(true);
    }
  };

  const handleCaptureDiscovery = async () => {
    if (!camera.isReady) {
      console.error('Camera is not ready');
      return;
    }

    const currentDetection = detection.getCurrentDetection();
    if (!currentDetection) {
      console.error('No detection available');
      return;
    }

    const photo = camera.capturePhoto();
    if (!photo) {
      console.error('Failed to capture photo');
      return;
    }

    // Here we would normally save the discovery to the store
    // For now, just log it
    console.log('Discovery captured:', {
      ...currentDetection,
      photo,
      timestamp: new Date().toISOString(),
    });

    // Reset detection for next capture
    detection.resetDetection();
    setTimeout(() => {
      // Detection continues running, just reset the result
    }, 1000);
  };

  if (!isInitialized) {
    return (
      <div className="app-container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#064E3B'
        }}>
          Loading PanGEO...
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="app-container">
        <Navigation
          onSettingsClick={() => setIsSettingsOpen(true)}
          onAchievementsClick={() => setIsAchievementsOpen(true)}
          onProgressClick={() => setIsProgressOpen(true)}
          onCommunityClick={() => setIsCommunityOpen(true)}
          onDataClick={() => setIsDataOpen(true)}
        />

        <main id="main-content" className="main-content">
          {currentScreen === 'game' ? (
            <GameScreen
              camera={camera}
              detection={detection}
              onStartGame={handleStartGame}
              onCapture={handleCaptureDiscovery}
              onViewCollection={() => setCurrentScreen('collection')}
            />
          ) : (
            <CollectionScreen
              onBackToGame={() => setCurrentScreen('game')}
            />
          )}
        </main>



        <Modal
          modal={modal}
          onClose={closeModal}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <Achievements
          isOpen={isAchievementsOpen}
          onClose={() => setIsAchievementsOpen(false)}
        />

        <Progress
          isOpen={isProgressOpen}
          onClose={() => setIsProgressOpen(false)}
        />

        <CommunityDashboard
          isOpen={isCommunityOpen}
          onClose={() => setIsCommunityOpen(false)}
        />

        <DataVisualization
          isOpen={isDataOpen}
          onClose={() => setIsDataOpen(false)}
        />

        {/* Scroll to Top Button */}
        <button
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            opacity: window.scrollY > 300 ? 1 : 0,
            visibility: window.scrollY > 300 ? 'visible' : 'hidden'
          }}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      </div>
    </ThemeProvider>
  );
}

export default App;
