import React from 'react';

interface RotationControlProps {
  isHorizontal: boolean;
  onRotate: () => void;
}

export const RotationControl: React.FC<RotationControlProps> = ({ isHorizontal, onRotate }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '60px',
      zIndex: 4,
      backgroundColor: 'white',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <button
        onClick={onRotate}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px'
        }}
        title={isHorizontal ? "Switch to Vertical Layout" : "Switch to Horizontal Layout"}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isHorizontal ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.3s ease'
          }}
        >
          <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9" />
          <polyline points="12 3 12 9 16 9" />
        </svg>
      </button>
    </div>
  );
}; 