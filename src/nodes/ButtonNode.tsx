import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ButtonNodeData } from './types';

type ButtonNodeProps = NodeProps<ButtonNodeData>;

export const ButtonNode = React.memo(({ 
  data,
  isConnectable,
  id
}: ButtonNodeProps) => {
  const isHeader = id === 'header';

  return (
    <div className="button-node" style={{
      padding: '15px',
      borderRadius: '4px',
      border: '2px solid #4CAF50',
      backgroundColor: 'white',
      minWidth: isHeader ? '300px' : '150px',
      textAlign: isHeader ? 'center' : 'left'
    }}>
      {!isHeader && (
        <div style={{ 
          fontSize: '12px', 
          color: '#666',
          marginBottom: '8px'
        }}>
          🔘 Button
        </div>
      )}
      <div style={{ 
        fontWeight: 'bold', 
        marginBottom: '8px',
        fontSize: isHeader ? '18px' : '14px'
      }}>
        {data.label}
      </div>
      {!isHeader && (
        <>
          <Handle
            type="target"
            position={Position.Top}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={isConnectable}
          />
        </>
      )}
    </div>
  );
}); 