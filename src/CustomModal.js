import React from 'react';
import './CustomModal.css';

function CustomModal({ show, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <p>{message}</p>
          <div className="modal-buttons">
            <button className="modal-button confirm" onClick={onConfirm}>Yes</button>
            <button className="modal-button cancel" onClick={onCancel}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomModal;
