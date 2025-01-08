import React, { useCallback, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import ReactMarkdown from 'react-markdown';
import type { ProjectMgmtNodeData } from './types';
import { storage } from '../utils/storage';

export const ProjectMgmtNode = React.memo(({ data, isConnectable = true, selected }: ProjectMgmtProps) => {
  const [showOutput, setShowOutput] = useState(false);
  const handleStyle = { background: '#4CAF50' };
  const isHorizontal = data.isHorizontal;

  const platformColors = {
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
      <div style={{ marginBottom: '8px' }}>
        <span>📋 Project Management</span>
        <span style={{ marginLeft: '8px', fontSize: '12px' }}>
          {data.platform}
        </span>
      </div>
      
      {/* Rest of the UI similar to ApiNode */}
    </div>
  );
}); 