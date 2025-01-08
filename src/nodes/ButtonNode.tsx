import React from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import type { ButtonNodeProps } from './types';

export const ButtonNode = React.memo(({ data, isConnectable = true, selected }: ButtonNodeProps) => {
  const handleStyle = { background: '#4CAF50' };
  const isHeader = data.label === 'React Flow Pipeline';
  const isHorizontal = data.isHorizontal;

  // Don't show handles or resizer for header node
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
      width: '100%',
      height: '100%',
      minWidth: '150px',
      minHeight: '50px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      <NodeResizer
        color="#4CAF50"
        isVisible={selected}
        minWidth={150}
        minHeight={50}
        handleStyle={{ width: '8px', height: '8px' }}
        lineStyle={{ border: '1px solid #4CAF50' }}
        keepAspectRatio={false}
      />
      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <div style={{ 
        fontSize: '14px',
        textAlign: 'center',
        marginTop: '0',
        width: '100%'
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