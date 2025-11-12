import React from 'react';
import type { ModalState } from '../../types';

interface ModalProps {
  modal: ModalState;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ modal, onClose }) => {
  if (!modal.isOpen) {
    return null;
  }

  const renderModalContent = () => {
    switch (modal.type) {
      case 'discovery':
        return (
          <div className="modal-content">
            <h3>New Discovery!</h3>
            <div className="discovered-card" id="discoveredCard">
              {/* Discovery content will be rendered here */}
              <p>Discovery modal content goes here</p>
            </div>
            <button className="modal-btn" id="closeModalBtn" onClick={onClose}>
              Continue Exploring
            </button>
          </div>
        );

      case 'achievement':
        return (
          <div className="modal-content achievement-modal">
            <h3>Achievement Unlocked!</h3>
            <div className="achievement-badge">
              <div className="achievement-icon">*</div>
              <div className="achievement-details">
                <h3>Achievement Title</h3>
                <p>Achievement description goes here</p>
              </div>
            </div>
            <button className="modal-btn" onClick={onClose}>
              Continue
            </button>
          </div>
        );

      case 'community-registration':
        return (
          <div className="modal-content community-modal">
            <h2>Join Your Neighborhood</h2>
            <p>Connect with your local community to earn collective points and unlock community rewards!</p>
            <button className="modal-btn secondary" onClick={onClose}>
              Skip for Now
            </button>
          </div>
        );

      default:
        return (
          <div className="modal-content">
            <h3>Modal</h3>
            <p>Modal content for type: {modal.type}</p>
            <button className="modal-btn" onClick={onClose}>
              Close
            </button>
          </div>
        );
    }
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      {renderModalContent()}
    </div>
  );
};
