import React, { useState, useEffect } from 'react';
import { Loading } from './Loading';
import { Camera, RotateCcw, BookOpen, Target, Trophy, RefreshCw, Search, Video, Zap, Eye } from 'lucide-react';
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
  const [showInstructions, setShowInstructions] = useState(false);

  const currentDetection = detection.getCurrentDetection();

  // Show instructions on first load
  useEffect(() => {
    if (!camera.isReady && !localStorage.getItem('pangeo-instructions-shown')) {
      setShowInstructions(true);
      localStorage.setItem('pangeo-instructions-shown', 'true');
    }
  }, [camera.isReady]);

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
    setCameraStarting(true);
    try {
      await onStartGame();
      setShowInstructions(false);
    } finally {
      setTimeout(() => setCameraStarting(false), 1000);
    }
  };

  return (
    <div
      className="game-screen"
      id="gameScreen"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Welcome Instructions Overlay */}
      {showInstructions && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              background: 'var(--bg-primary)',
              padding: '3rem',
              borderRadius: '20px',
              maxWidth: '500px',
              textAlign: 'center',
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
              lineHeight: '1.6',
              fontSize: '1.1rem'
            }}>
              Discover and identify amazing species in your environment.
              Point your camera at plants, insects, and animals to start your collection!
            </p>
            <button
              onClick={() => setShowInstructions(false)}
              style={{
                background: 'var(--primary-sage)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Full Screen Camera Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Camera Feed Container */}
        <div
          className="camera-feed-container"
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 80px rgba(0,0,0,0.2)',
            transition: 'all 0.4s ease',
            background: 'var(--bg-secondary)',
            width: '100%',
            height: '100%',
          }}
        >
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
              transition: 'all 0.4s ease',
              filter: captureFeedback
                ? 'brightness(1.3) saturate(1.4) contrast(1.1)'
                : 'none',
              transform: captureFeedback ? 'scale(1.03)' : 'scale(1)',
            }}
          />
          <canvas
            ref={camera.canvasRef}
            id="captureCanvas"
            style={{ display: 'none' }}
          />

          {/* Detection Results Overlay */}
          {currentDetection && (
            <div
              className="detection-overlay"
              style={{
                position: 'absolute',
                top: '30px',
                left: '30px',
                right: '30px',
                background: 'rgba(6, 78, 59, 0.96)',
                color: 'white',
                padding: '2rem',
                borderRadius: '18px',
                backdropFilter: 'blur(25px)',
                border: '3px solid rgba(255,255,255,0.25)',
                boxShadow: '0 12px 40px rgba(6, 78, 59, 0.4)',
                animation: 'animate-slide-in-down 0.5s ease-out',
                zIndex: 20,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  animation: 'animate-bounce-in 0.7s ease-out'
                }}>
                  <Target size={32} color="#FFD700" />
                </div>

                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: '900',
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.02em',
                  fontFamily: 'Playfair Display, serif',
                  textTransform: 'uppercase',
                }}>
                  {currentDetection.species}
                </h3>

                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '2rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255,255,255,0.15)',
                    padding: '0.5rem 1rem',
                    borderRadius: '15px',
                  }}>
                    <Zap size={16} />
                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>
                      {currentDetection.confidence.toFixed(1)}% Confidence
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255,215,0,0.2)',
                    padding: '0.5rem 1rem',
                    borderRadius: '15px',
                  }}>
                    <Trophy size={16} color="#FFD700" />
                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>
                      +{currentDetection.points} Points
                    </span>
                  </div>
                </div>

                {/* Rarity Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}>
                  <span>⭐ {currentDetection.rarity}</span>
                </div>
              </div>
            </div>
          )}

          {/* Camera Status Indicators */}
          <div style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            display: 'flex',
            gap: '1rem',
            zIndex: 15,
          }}>
            {camera.isReady && (
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.7)',
                animation: 'animate-pulse 2s infinite',
                border: '2px solid white',
              }} />
            )}

            {detection.isDetecting && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(59, 130, 246, 0.9)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '700',
                border: '2px solid rgba(255,255,255,0.3)',
              }}>
                <RefreshCw size={14} className="animate-spin" />
                <span>Scanning</span>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div
            className="camera-controls"
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '30px',
              right: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            {/* Flip Camera */}
            <button
              onClick={camera.flipCamera}
              disabled={!camera.isReady}
              className="control-btn flip-btn"
              style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.95)',
                color: 'var(--text-primary)',
                border: '3px solid rgba(255,255,255,0.8)',
                borderRadius: '50%',
                cursor: camera.isReady ? 'pointer' : 'not-allowed',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                opacity: camera.isReady ? 1 : 0.4,
              }}
              aria-label="Flip camera"
            >
              <RotateCcw size={24} />
            </button>

            {/* Capture Button */}
            <button
              onClick={handleCapture}
              disabled={!camera.isReady || !currentDetection || isProcessing}
              className="capture-btn"
              style={{
                flex: 1,
                maxWidth: '220px',
                background: (!camera.isReady || !currentDetection || isProcessing)
                  ? 'rgba(107, 114, 128, 0.9)'
                  : 'linear-gradient(135deg, var(--primary-sage), var(--deep-sage))',
                color: 'white',
                border: '4px solid rgba(255,255,255,0.3)',
                padding: '1.5rem 2.5rem',
                borderRadius: '35px',
                cursor: (camera.isReady && currentDetection && !isProcessing) ? 'pointer' : 'not-allowed',
                fontSize: '1.2rem',
                fontWeight: '800',
                boxShadow: (camera.isReady && currentDetection && !isProcessing)
                  ? '0 10px 30px rgba(122, 155, 122, 0.5)'
                  : '0 6px 18px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                transform: isProcessing ? 'scale(0.92)' : 'scale(1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
              aria-label="Capture discovery"
            >
              {isProcessing ? (
                <>
                  <Loading size="medium" type="spinner" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Camera size={24} />
                  <span>Capture</span>
                </>
              )}
            </button>

            {/* Collection Button */}
            <button
              onClick={onViewCollection}
              className="collection-btn"
              style={{
                background: 'rgba(255,255,255,0.95)',
                color: 'var(--text-primary)',
                border: '3px solid rgba(255,255,255,0.8)',
                padding: '1rem 2rem',
                borderRadius: '28px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '700',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}
              aria-label="View collection"
            >
              <BookOpen size={18} />
              <span>Collection</span>
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {!camera.isReady && (
          <div
            className="camera-setup"
            style={{
              marginTop: '1rem',
              textAlign: 'center',
              padding: '1rem',
              background: 'var(--bg-secondary)',
              borderRadius: '20px',
              border: '3px solid var(--border-primary)',
              animation: 'animate-fade-in 0.6s ease-out',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              animation: 'animate-float 4s ease-in-out infinite'
            }}>
              <Camera size={64} color="var(--primary-sage)" />
            </div>

            <h3 style={{
              marginBottom: '1.5rem',
              color: 'var(--text-primary)',
              fontSize: '1.8rem',
              fontWeight: '800',
              fontFamily: 'Playfair Display, serif',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            }}>
              Camera Access Required
            </h3>

            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '3rem',
              fontSize: '1.1rem',
              lineHeight: '1.7',
              maxWidth: '600px',
              margin: '0 auto 3rem',
            }}>
              Grant camera permissions to begin your nature discovery journey.
              We'll help you identify fascinating species and build your personal collection.
            </p>

            <button
              onClick={handleStartCamera}
              disabled={cameraStarting}
              className="enable-camera-btn"
              style={{
                background: cameraStarting
                  ? 'var(--border-secondary)'
                  : 'linear-gradient(135deg, var(--primary-sage), var(--deep-sage))',
                color: 'white',
                border: 'none',
                padding: '1.5rem 3.5rem',
                borderRadius: '15px',
                cursor: cameraStarting ? 'not-allowed' : 'pointer',
                fontSize: '1.3rem',
                fontWeight: '800',
                transition: 'all 0.4s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: cameraStarting
                  ? 'none'
                  : '0 8px 25px rgba(122, 155, 122, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {cameraStarting ? (
                <>
                  <Loading size="medium" type="spinner" />
                  <span>Initializing Camera...</span>
                </>
              ) : (
                <>
                  <Video size={24} />
                  <span>Enable Camera</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Ready to Detect State */}
        {camera.isReady && !detection.isDetecting && !currentDetection && (
          <div
            className="ready-state"
            style={{
              marginTop: '1rem',
              textAlign: 'center',
              padding: '1rem',
              background: 'var(--bg-secondary)',
              borderRadius: '20px',
              border: '3px solid var(--border-primary)',
              animation: 'animate-scale-in 0.5s ease-out',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              animation: 'animate-pulse 3s infinite'
            }}>
              <Search size={56} color="var(--primary-sage)" />
            </div>

            <h3 style={{
              marginBottom: '1.5rem',
              color: 'var(--text-primary)',
              fontSize: '1.6rem',
              fontWeight: '800',
              fontFamily: 'Playfair Display, serif',
              textTransform: 'uppercase',
            }}>
              Ready to Detect
            </h3>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              lineHeight: '1.7',
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              Point your camera at plants, insects, or animals around you.
              Our AI will identify species and help you build your discovery collection!
            </p>

            <div style={{
              marginTop: '2rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(122, 155, 122, 0.1)',
                padding: '0.75rem 1.5rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: 'var(--primary-sage)',
                fontWeight: '600',
              }}>
                <Eye size={16} />
                <span>Plants & Flowers</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(122, 155, 122, 0.1)',
                padding: '0.75rem 1.5rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: 'var(--primary-sage)',
                fontWeight: '600',
              }}>
                <Target size={16} />
                <span>Insects & Bugs</span>
              </div>
            </div>
          </div>
        )}

        {/* Scanning State */}
        {camera.isReady && detection.isDetecting && !currentDetection && (
          <div
            className="scanning-state"
            style={{
              marginTop: '1rem',
              textAlign: 'center',
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1))',
              borderRadius: '20px',
              border: '3px solid var(--info)',
              animation: 'animate-fade-in 0.4s ease-out',
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.2)',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              animation: 'animate-pulse 1.8s infinite'
            }}>
              <RefreshCw size={48} color="var(--info)" className="animate-spin" />
            </div>

            <h3 style={{
              marginBottom: '1rem',
              color: 'var(--text-primary)',
              fontSize: '1.5rem',
              fontWeight: '800',
              fontFamily: 'Playfair Display, serif',
              textTransform: 'uppercase',
            }}>
              Analyzing...
            </h3>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: '1.6',
            }}>
              Processing your camera feed for species identification
            </p>

            <div style={{
              marginTop: '2rem',
              width: '100%',
              maxWidth: '300px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              <div style={{
                height: '6px',
                background: 'var(--silver)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--info), var(--primary-sage))',
                  borderRadius: '3px',
                  animation: 'shimmer 2s ease-in-out infinite',
                }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
