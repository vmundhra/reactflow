import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { SourceNodeProps } from './types';

export const SourceNode = React.memo(({ data, isConnectable = true }: SourceNodeProps) => {
  const handleStyle = { background: '#4CAF50' };
  const isHorizontal = data.isHorizontal;

  return (
    <div style={{
      padding: '10px',
      borderRadius: '3px',
      border: '1px solid #1E88E5',
      background: 'white',
      minWidth: '200px',
      position: 'relative'
    }}>
      <div style={{ 
        fontSize: '12px', 
        color: '#666',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span>🔗 Source</span>
      </div>
      <div style={{ 
        fontSize: '14px',
        marginBottom: '8px'
      }}>
        {data.label}
      </div>
      <div style={{
        fontSize: '12px',
        color: '#666',
        wordBreak: 'break-all'
      }}>
        {data.sourceUrl}
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