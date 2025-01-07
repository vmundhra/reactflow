import React from 'react';
import type { Node } from '@xyflow/react';
import { nodeControlsStyles } from '../styles/nodeControlsStyles';

interface NodeControlsProps {
  node: Node;
  onEdit: (node: Node) => void;
  onDelete: (node: Node) => void;
}

export const NodeControls: React.FC<NodeControlsProps> = ({ node, onEdit, onDelete }) => {
  const isHeader = node.id === 'header';

  if (isHeader) return null;

  return (
    <div style={nodeControlsStyles.container}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(node);
        }}
        style={nodeControlsStyles.button}
      >
        🔧
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(node);
        }}
        style={nodeControlsStyles.button}
      >
        🗑️
      </button>
    </div>
  );
}; 