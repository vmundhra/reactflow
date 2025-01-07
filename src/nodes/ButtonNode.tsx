import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { ButtonNodeProps } from './types';

export const ButtonNode = React.memo(({ data, isConnectable = true }: ButtonNodeProps) => {
  const handleStyle = { background: '#4CAF50' };
  const isHeader = data.label === 'React Flow Pipeline';
  const isHorizontal = data.isHorizontal;

  // Don't show handles for header node
  if (isHeader) {
    return (
      <div style={{
        padding: '10px',
        borderRadius: '3px',
        border: '1px solid #4CAF50',
        background: 'white',
        minWidth: '150px'
      }}>
        <div style={{ 
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {data.label}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '10px',
      borderRadius: '3px',
      border: '1px solid #4CAF50',
      background: 'white',
      minWidth: '150px',
      position: 'relative'
    }}>
      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <div style={{ 
        fontSize: '14px',
        textAlign: 'center'
      }}>
        {data.label}
      </div>
      <Handle
        type="source"
        position={isHorizontal ? Position.Right : Position.Bottom}
        style={handleStyle}
        isConnectable={isConnectable}
      />
    </div>
  );
}); 