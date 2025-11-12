import React from 'react';
import { useGameStore } from '../../stores/gameStore';

interface CollectionScreenProps {
  onBackToGame: () => void;
}

export const CollectionScreen: React.FC<CollectionScreenProps> = ({ onBackToGame }) => {
  const { gameData } = useGameStore();

  return (
    <div className="collection-screen container-fluid scroll-container" id="collectionScreen">
      <div className="collection-header sticky-header">
        <button
          className="back-btn"
          id="backToGameBtn"
          onClick={onBackToGame}
          aria-label="Back to game"
        >
          ← Back to Game
        </button>
        <h2>Your Collection</h2>
        <div className="collection-stats">
          <span>{gameData.discoveries.length} discoveries</span>
          <span>{gameData.discoveredSpecies.length} species</span>
        </div>
      </div>

      <div className="cards-grid grid-auto-fit" id="cardsGrid">
        {gameData.discoveries.length === 0 ? (
          <div className="empty-state" style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '3rem 2rem',
            color: 'var(--text-secondary)',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '2px dashed var(--border-secondary)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📷</div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No discoveries yet!</h3>
            <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Start capturing insects and plants to build your collection.
            </p>
          </div>
        ) : (
          gameData.discoveries.map((discovery) => (
            <div
              key={discovery.id}
              className={`species-card ${discovery.rarity}`}
              style={{ position: 'relative' }}
              role="article"
              aria-label={`${discovery.species} discovery`}
            >
              <div className={`rarity-badge ${discovery.rarity}`}>
                {discovery.rarity.toUpperCase()}
              </div>
              <img
                src={discovery.photo}
                alt={`Photo of ${discovery.species}`}
                className="card-image"
                loading="lazy"
              />
              <div className="card-info">
                <h4>{discovery.species}</h4>
                <div className="card-stats">
                  <span>+{discovery.points} pts</span>
                  <span>{discovery.confidence}% confidence</span>
                </div>
                <div className="card-stats">
                  <span>{new Date(discovery.timestamp).toLocaleDateString()}</span>
                  <span>{discovery.location || 'Unknown location'}</span>
                </div>
                {discovery.weather && (
                  <div className="card-stats">
                    <span>Weather: {discovery.weather}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
