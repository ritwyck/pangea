import React, { useState, useEffect } from 'react';
import { Loading } from './Loading';
import { Camera, RotateCcw, BookOpen, Target, Trophy, RefreshCw, Search, Video, Zap, Eye } from 'lucide-react';
import type { UseCameraReturn, UseDetectionReturn } from '../../types';

interface GameScreenProps {
  camera: UseCameraReturn;
  detection: UseDetectionReturn;
  onStartGame: () => Promise<void>;
  onStopGame: () => void;
  onCapture: () => void;
  onViewCollection: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  camera,
  detection,
  onStartGame,
  onStopGame,
  onCapture,
  onViewCollection,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [captureFeedback, setCaptureFeedback] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const currentDetection = detection.getCurrentDetection();

  // Instructions disabled - always show enable overlay
  // useEffect(() => {
  //   if (!camera.isReady && !localStorage.getItem('pangeo-instructions-shown')) {
  //     setShowInstructions(true);
  //     localStorage.setItem('pangeo-instructions-shown', 'true');
  //   }
  // }, [camera.isReady]);

  const handleCapture = async () => {
    if (isProcessing || !currentDetection) return;

    setIsProcessing(true);
    setCaptureFeedback(true);

    try {
      await onCapture();
      setTimeout(() => setCaptureFeedback(false), 500);
    } finally {
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  const handleStartCamera = async () => {
    if (camera.isReady) {
      // Permanently disable camera
      camera.stopCamera();
      onStopGame(); // Stop detection and set game inactive permanently
    } else {
      // Enable camera
      setCameraStarting(true);
      try {
        await onStartGame();
        setShowInstructions(false);
      } finally {
        setTimeout(() => setCameraStarting(false), 1000);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        left: '0',
        width: '100vw',
        height: 'calc(100vh - 80px)',
        zIndex: 100,
        background: 'var(--bg-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Camera Background Layer */}
      {camera.isReady && (
        <video
          ref={camera.videoRef}
          id="videoElement"
          autoPlay
          muted
          playsInline
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            filter: captureFeedback
              ? 'brightness(1.3) saturate(1.4) contrast(1.1)'
              : 'none',
            transform: captureFeedback ? 'scale(1.03)' : 'scale(1)',
            transition: 'filter 0.3s ease, transform 0.3s ease',
            zIndex: 0,
          }}
        />
      )}
      <canvas
        ref={camera.canvasRef}
        id="captureCanvas"
        style={{ display: 'none' }}
      />

      {/* Fixed Products Overlay */}
      {(!camera.isReady || !currentDetection) && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.7)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!camera.isReady ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                background: 'var(--bg-primary)',
                borderRadius: '20px',
                maxWidth: '500px',
                border: '3px solid var(--primary-sage)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
              <h2 style={{
                color: 'var(--primary-sage)',
                fontFamily: 'Playfair Display, serif',
                fontSize: '2rem',
                marginBottom: '1rem',
                fontWeight: '800'
              }}>
                Welcome to PanGEO
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                Discover and identify amazing species in your environment.
                Point your camera at plants, insects, and animals to start your collection!
              </p>
              <button
                onClick={handleStartCamera}
                disabled={cameraStarting}
                style={{
                  background: cameraStarting
                    ? 'var(--border-secondary)'
                    : 'linear-gradient(135deg, var(--primary-sage), var(--deep-sage))',
                  color: 'white',
                  border: 'none',
                  padding: '1.5rem 3rem',
                  borderRadius: '15px',
                  cursor: cameraStarting ? 'not-allowed' : 'pointer',
                  fontSize: '1.3rem',
                  fontWeight: '800',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: cameraStarting
                    ? 'none'
                    : '0 8px 25px rgba(122, 155, 122, 0.4)',
                }}
              >
                {cameraStarting ? (
                  <>
                    Loading...
                  </>
                ) : (
                  <>
                    <Video size={24} />
                    Enable Camera
                  </>
                )}
              </button>
            </div>
          ) : camera.isReady && detection.isDetecting && !currentDetection ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                background: 'rgba(59, 130, 246, 0.9)',
                color: 'white',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
              }}
            >
              <RefreshCw size={48} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
              <h3>Analyzing your environment...</h3>
              <p style={{ opacity: 0.8 }}>Looking for species to identify</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Detection Results Overlay */}
      {currentDetection && (
        <div
          style={{
            position: 'fixed',
            top: '100px',
            left: '20px',
            right: '20px',
            bottom: '100px',
            background: 'rgba(6, 78, 59, 0.96)',
            color: 'white',
            padding: '3rem',
            borderRadius: '24px',
            backdropFilter: 'blur(25px)',
            border: '3px solid rgba(255,255,255,0.25)',
            boxShadow: '0 20px 80px rgba(6, 78, 59, 0.5)',
            zIndex: 70,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div>
            <Target size={48} color="#FFD700" style={{ marginBottom: '1rem' }} />
            <h3 style={{
              fontSize: '2rem',
              fontFamily: 'Playfair Display, serif',
              marginBottom: '1rem',
            }}>
              Species Found!
            </h3>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}>
              {currentDetection.species}
            </h2>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginBottom: '2rem',
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '1rem 2rem',
                borderRadius: '20px',
              }}>
                <Zap size={24} />
                <div>{currentDetection.confidence.toFixed(1)}% Confidence</div>
              </div>
              <div style={{
                background: 'rgba(255,215,0,0.3)',
                padding: '1rem 2rem',
                borderRadius: '20px',
              }}>
                <Trophy size={24} color="#FFD700" />
                <div>+{currentDetection.points} Points</div>
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '1rem 3rem',
              borderRadius: '30px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}>
              ⭐ Rarity: {currentDetection.rarity}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Camera Enable/Disable Button */}
      <button
        onClick={handleStartCamera}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: camera.isReady
            ? 'rgba(220, 38, 38, 0.9)'
            : 'rgba(5, 150, 105, 0.9)',
          color: 'white',
          border: 'none',
          padding: '1rem 1.5rem',
          borderRadius: '30px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <Video size={20} />
        {camera.isReady ? 'Disable Camera' : 'Enable Camera'}
      </button>

      {/* Fixed Controls */}
      {camera.isReady && (
        <>
          {/* Capture Button */}
          <button
            onClick={handleCapture}
            disabled={!camera.isReady || !currentDetection || isProcessing}
            style={{
              position: 'fixed',
              bottom: '120px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: (!camera.isReady || !currentDetection || isProcessing)
                ? 'rgba(107, 114, 128, 0.8)'
                : 'rgba(255, 255, 255, 0.9)',
              color: (!camera.isReady || !currentDetection || isProcessing) ? 'white' : 'var(--text-primary)',
              border: '4px solid rgba(255,255,255,0.5)',
              padding: '1.5rem 4rem',
              borderRadius: '50px',
              cursor: (camera.isReady && currentDetection && !isProcessing) ? 'pointer' : 'not-allowed',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              zIndex: 200,
              boxShadow: '0 6px 30px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {isProcessing ? (
              <>
                Processing...
              </>
            ) : (
              <>
                <Camera size={28} />
                Capture
              </>
            )}
          </button>

          {/* Other Controls */}
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            display: 'flex',
            gap: '1rem',
            zIndex: 200,
          }}>
            <button
              onClick={camera.flipCamera}
              disabled={!camera.isReady}
              style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: camera.isReady ? 1 : 0.5,
              }}
            >
              <RotateCcw size={24} />
            </button>
            <button
              onClick={onViewCollection}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                padding: '1rem 1.5rem',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Collection
            </button>
          </div>
        </>
      )}

      {/* Status Indicator */}
      {camera.isReady && detection.isDetecting && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(59, 130, 246, 0.9)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '25px',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
          Scanning
        </div>
      )}
    </div>
  );
};
