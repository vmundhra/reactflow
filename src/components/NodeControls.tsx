import React from 'react';
import type { Node } from '@xyflow/react';
import { nodeControlsStyles } from '../styles/nodeControlsStyles';
import type { AppNode } from '../nodes/types';

interface NodeControlsProps {
  node: AppNode;
  onEdit: (node: Node) => void;
  onDelete: (node: Node) => void;
}

export const NodeControls: React.FC<NodeControlsProps> = ({ node, onEdit, onDelete }) => {
  const isHeader = node.id === 'header';
  const isApiNode = node.type === 'api';
  const isCmsNode = node.type === 'cms';
  const isProjectMgmtNode = node.type === 'projectMgmt';

  if (isHeader) return null;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Play button clicked, node data:', node.data);
    
    if (node.data && typeof node.data.executeApiCall === 'function') {
      console.log('Executing API call...');
      node.data.executeApiCall();
    } else if (node.data && typeof node.data.executeQuery === 'function') {
      console.log('Executing query...');
      node.data.executeQuery();
    } else {
      console.error('Execute function is not available:', {
        nodeData: node.data,
        executeApiCall: node.data?.executeApiCall,
        executeQuery: node.data?.executeQuery
      });
    }
  };

  return (
    <div style={nodeControlsStyles.container}>
      {(isApiNode || isCmsNode || isProjectMgmtNode) && (
        <button
          onClick={handlePlayClick}
          disabled={node.data.isLoading}
          style={{
            ...nodeControlsStyles.button,
            backgroundColor: node.data.isLoading ? '#ccc' : '#4CAF50',
            color: 'white',
          }}
          title={node.data.isLoading ? 'Running...' : 'Run Query'}
        >
          {node.data.isLoading ? '⌛' : '▶️'}
        </button>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(node);
        }}
        style={nodeControlsStyles.button}
        title="Edit Node"
      >
        🔧
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(node);
        }}
        style={nodeControlsStyles.button}
        title="Delete Node"
      >
        🗑️
      </button>
    </div>
  );
}; 