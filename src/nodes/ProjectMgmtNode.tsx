import React, { useCallback, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import type { ProjectMgmtNodeProps } from './types';

export const ProjectMgmtNode = React.memo(({ data, isConnectable = true, selected }: ProjectMgmtNodeProps) => {
  const [showOutput, setShowOutput] = useState(false);
  const handleStyle = { background: '#4CAF50' };
  const isHorizontal = data.isHorizontal;

  const platformColors: Record<'jira' | 'asana' | 'trello', string> = {
    jira: '#0052CC',
    asana: '#F06A6A',
    trello: '#0079BF'
  };

  const executeQuery = useCallback(async () => {
    try {
      const response = await fetch(`${data.endpoint}`, {
        headers: {
          'Authorization': `Bearer ${data.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      // Update node data
      data.onUpdate?.({
        ...data,
        response: result,
        lastRun: new Date(),
        error: undefined
      });

    } catch (error: any) {
      data.onUpdate?.({
        ...data,
        error: error.message,
        response: undefined,
        lastRun: new Date()
      });
    }
  }, [data]);

  return (
    <div style={{
      padding: '10px',
      borderRadius: '3px',
      border: '1px solid #9C27B0',
      background: 'white',
      minWidth: '250px',
      position: 'relative'
    }}>
      <NodeResizer
        color="#9C27B0"
        isVisible={selected}
        minWidth={250}
        minHeight={100}
        handleStyle={{ width: '8px', height: '8px' }}
        lineStyle={{ border: '1px solid #9C27B0' }}
        keepAspectRatio={false}
      />
      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <div style={{ marginBottom: '8px' }}>
        <span>📋 Project Management</span>
        <span style={{ 
          marginLeft: '8px', 
          fontSize: '12px',
          backgroundColor: platformColors[data.platform as keyof typeof platformColors],
          color: 'white',
          padding: '2px 6px',
          borderRadius: '3px'
        }}>
          {data.platform}
        </span>
      </div>
      
      {/* Rest of the UI similar to ApiNode */}
      
      <Handle
        type="source"
        position={isHorizontal ? Position.Right : Position.Bottom}
        style={handleStyle}
        isConnectable={isConnectable}
      />
    </div>
  );
}); 