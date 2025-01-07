import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export interface SourceNodeData {
  label: string;
  sourceUrl: string;
  dataKey?: string;
}

export const SourceNode: React.FC<NodeProps<SourceNodeData>> = ({ 
  data,
  isConnectable 
}) => {
  return (
    <div className="source-node" style={{
      padding: '15px',
      borderRadius: '4px',
      border: '2px solid #2196F3',
      backgroundColor: 'white',
      minWidth: '200px'
    }}>
      <div style={{ 
        fontSize: '12px', 
        color: '#666',
        marginBottom: '8px'
      }}>
        🔗 Source
      </div>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        {data.label}
      </div>
      <div style={{ 
        fontSize: '12px',
        backgroundColor: '#f5f5f5',
        padding: '4px',
        borderRadius: '4px',
        wordBreak: 'break-all'
      }}>
        {data.sourceUrl}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
}; 