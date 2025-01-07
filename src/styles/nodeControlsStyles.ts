import { CSSProperties } from 'react';

interface NodeControlsStyles {
  container: CSSProperties;
  button: CSSProperties;
}

export const nodeControlsStyles: NodeControlsStyles = {
  container: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    display: 'flex',
    gap: '4px',
    zIndex: 1000,
  },
  button: {
    border: 'none',
    background: '#f5f5f5',
    borderRadius: '4px',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
}; 