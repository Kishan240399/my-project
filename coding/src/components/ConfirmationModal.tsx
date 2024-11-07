import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300, // Ensure modal is on top of other elements
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          width: '400px',
          maxWidth: '90%',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '20px',
          }}
        >
          Are you sure you want to delete this ambulance?
        </h3>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              color: '#333',
              backgroundColor: '#e0e0e0',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              border: 'none',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ccc'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: '#d32f2f',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              border: 'none',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c2185b'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
