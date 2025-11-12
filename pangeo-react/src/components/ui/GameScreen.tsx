import React, { useState, useEffect } from 'react';
import { Loading } from './Loading';
import { Camera, RotateCcw, BookOpen, Target, Trophy, RefreshCw, Search, Video } from 'lucide-react';
import type { UseCameraReturn, UseDetectionReturn } from '../../types';

interface GameScreenProps {
  camera: UseCameraReturn;
  detection: UseDetectionReturn;
  onStartGame: () => void;
  onCapture: () => void;
  onViewCollection: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  camera,
  detection,
  onStartGame,
  onCapture,
  onViewCollection,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [captureFeedback, setCaptureFeedback] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);

  const currentDetection = detection.getCurrentDetection();

  const handleCapture = async () => {
    if (isProcessing || !currentDetection) return;

    setIsProcessing(true);
    setCaptureFeedback(true);

    try {
      await onCapture();

      // Visual feedback animation
      setTimeout(() => setCaptureFeedback(false), 500);
    } finally {
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  const handleStartCamera = async () => {
    setCameraStarting(true);
    try {
      await onStartGame();
    } finally {
      setTimeout(() => setCameraStarting(false), 1000);
    }
  };

  return (
    <div className="game-screen container-fluid" id="gameScreen">
      <div className="camera-container">
        {/* Camera Feed with Enhanced Styling */}
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
        }}>
          <video
            ref={camera.videoRef}
            id="videoElement"
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '16px',
              transition: 'all 0.3s ease',
              filter: captureFeedback ? 'brightness(1.2) saturate(1.3)' : 'none',
              transform: captureFeedback ? 'scale(1.02)' : 'scale(1)',
            }}
          />
          <canvas
            ref={camera.canvasRef}
            id="captureCanvas"
            style={{ display: 'none' }}
          />

          {/* Enhanced Detection Overlay */}
          {currentDetection && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                background: 'rgba(6, 78, 59, 0.95)',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '16px',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(6, 78, 59, 0.3)',
                animation: 'animate-slide-in-down 0.4s ease-out',
                zIndex: 10,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '0.5rem',
                  animation: 'animate-bounce-in 0.6s ease-out'
                }}>
                  <Target size={28} />
                </div>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.01em'
                }}>
                  {currentDetection.species}
                </h3>
                <div style={{
                  fontSize: '1rem',
                  opacity: 0.9,
                  marginBottom: '0.5rem'
                }}>
                  Confidence: <strong>{currentDetection.confidence.toFixed(1)}%</strong>
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <Trophy size={16} />
                  <span>+{currentDetection.points} points</span>
                </div>

                {/* Rarity Indicator */}
                <div style={{
                  marginTop: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                }}>
                  <span style={{ textTransform: 'capitalize' }}>
                    {currentDetection.rarity}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Camera Status Indicator */}
          {camera.isReady && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
              animation: 'animate-pulse 2s infinite',
              zIndex: 10,
            }} />
          )}

          {/* Enhanced Camera Controls */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}>
            {/* Flip Camera Button */}
            <button
              onClick={camera.flipCamera}
              disabled={!camera.isReady}
              style={{
                width: '50px',
                height: '50px',
                background: 'rgba(255,255,255,0.95)',
                color: 'var(--text-primary)',
                border: 'none',
                borderRadius: '50%',
                cursor: camera.isReady ? 'pointer' : 'not-allowed',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                opacity: camera.isReady ? 1 : 0.5,
              }}
              aria-label="Flip camera"
            >
              <RotateCcw size={20} />
            </button>

            {/* Enhanced Capture Button */}
            <button
              onClick={handleCapture}
              disabled={!camera.isReady || !currentDetection || isProcessing}
              style={{
                flex: 1,
                maxWidth: '200px',
                background: (!camera.isReady || !currentDetection || isProcessing)
                  ? 'rgba(107, 114, 128, 0.8)'
                  : 'var(--primary-emerald)',
                color: 'white',
                border: 'none',
                padding: '1.2rem 2rem',
                borderRadius: '30px',
                cursor: (camera.isReady && currentDetection && !isProcessing) ? 'pointer' : 'not-allowed',
                fontSize: '1.1rem',
                fontWeight: '700',
                boxShadow: (camera.isReady && currentDetection && !isProcessing)
                  ? '0 8px 25px rgba(6, 78, 59, 0.4)'
                  : '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                transform: isProcessing ? 'scale(0.95)' : 'scale(1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
              aria-label="Capture discovery"
            >
              {isProcessing ? (
                <>
                  <Loading size="small" type="spinner" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Camera size={20} />
                  <span>Capture</span>
                </>
              )}
            </button>

            {/* View Collection Button */}
            <button
              onClick={onViewCollection}
              style={{
                background: 'rgba(255,255,255,0.95)',
                color: 'var(--text-primary)',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              aria-label="View collection"
            >
              <BookOpen size={16} />
              <span>Collection</span>
            </button>
          </div>
        </div>

        {/* Enhanced Status Messages */}
        {!camera.isReady && (
          <div style={{
            marginTop: '2rem',
            textAlign: 'center',
            padding: '2.5rem',
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            border: '2px solid var(--border-primary)',
            animation: 'animate-fade-in 0.5s ease-out',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem',
              animation: 'animate-float 3s ease-in-out infinite'
            }}>
              <Camera size={48} />
            </div>
            <h3 style={{
              marginBottom: '1rem',
              color: 'var(--text-primary)',
              fontSize: '1.3rem',
              fontWeight: '700'
            }}>
              Camera Access Required
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              Allow camera access to start discovering amazing species in your area.
            </p>
            <button
              onClick={handleStartCamera}
              disabled={cameraStarting}
              style={{
                background: cameraStarting ? 'var(--border-secondary)' : 'var(--primary-emerald)',
                color: 'white',
                border: 'none',
                padding: '1.2rem 2.5rem',
                borderRadius: '12px',
                cursor: cameraStarting ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: cameraStarting ? 'none' : '0 6px 20px rgba(6, 78, 59, 0.3)',
              }}
            >
              {cameraStarting ? (
                <>
                  <Loading size="small" type="spinner" />
                  <span>Starting Camera...</span>
                </>
              ) : (
                <>
                  <Video size={20} />
                  <span>Enable Camera</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Detection Ready State */}
        {camera.isReady && !detection.isDetecting && !currentDetection && (
          <div style={{
            marginTop: '2rem',
            textAlign: 'center',
            padding: '2rem',
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            border: '2px solid var(--border-primary)',
            animation: 'animate-scale-in 0.4s ease-out',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem',
              animation: 'animate-pulse 2s infinite'
            }}>
              <Search size={40} />
            </div>
            <h3 style={{
              marginBottom: '1rem',
              color: 'var(--text-primary)',
              fontSize: '1.2rem',
              fontWeight: '700'
            }}>
              Ready to Detect
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              Point your camera at plants, insects, or animals to identify species and earn points!
            </p>
          </div>
        )}

        {/* Detection Active State */}
        {camera.isReady && detection.isDetecting && !currentDetection && (
          <div style={{
            marginTop: '2rem',
            textAlign: 'center',
            padding: '2rem',
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            border: '2px solid var(--info)',
            animation: 'animate-fade-in 0.3s ease-out',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem',
              animation: 'animate-pulse 1.5s infinite'
            }}>
              <RefreshCw size={32} />
            </div>
            <h3 style={{
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Scanning...
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>
              Analyzing your surroundings for species
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
