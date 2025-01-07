import React from 'react';
import type { Node } from '@xyflow/react';

interface NodeControlsProps {
  node: Node;
  onEdit: (node: Node) => void;
  onDelete: (node: Node) => void;
}

export const NodeControls: React.FC<NodeControlsProps> = ({ node, onEdit, onDelete }) => {
  const isHeader = node.id === 'header';

  if (isHeader) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '-10px',
      right: '-10px',
      display: 'flex',
      gap: '4px',
      zIndex: 1000,
    }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(node);
        }}
        style={{
          border: 'none',
          background: '#f5f5f5',
          borderRadius: '4px',
          padding: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        🔧
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(node);
        }}
        style={{
          border: 'none',
          background: '#f5f5f5',
          borderRadius: '4px',
          padding: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        🗑️
      </button>
    </div>
  );
}; 