import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import ReactMarkdown from 'react-markdown';
import { ButtonNodeData } from './types';

const defaultStyles = {
  headerNode: {
    width: '300px',
    height: '80px',
    padding: '10px',
    backgroundColor: 'white',
    border: '2px solid #4CAF50',
    borderRadius: '4px',
  },
  regularNode: {
    width: '150px',
    height: '150px',
    padding: '15px',
    backgroundColor: 'white',
    border: '2px solid #4CAF50',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  }
};

export const ButtonNode: React.FC<NodeProps<ButtonNodeData>> = ({ 
  data,
  isConnectable,
  id 
}) => {
  const isHeader = id === 'header';
  const nodeStyle = isHeader ? defaultStyles.headerNode : defaultStyles.regularNode;

  return (
    <div className="button-node" style={nodeStyle}>
      <Handle 
        type="target" 
        position={Position.Top} 
        isConnectable={isConnectable}
      />
      <div className="button-node-content">
        {isHeader ? (
          <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
            {data.label}
          </div>
        ) : (
          <button 
            onClick={data.onClick} 
            className="node-button"
            style={defaultStyles.button}
          >
            {data.label}
          </button>
        )}
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        isConnectable={isConnectable}
      />
    </div>
  );
}; 